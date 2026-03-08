import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { User } from "../users/entities/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { MailService } from "../mail/mail.service";
import { UserService } from "./user/user.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  async getTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: "7d",
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  // 1. REGISTER
  async register(dto: RegisterDto) {
    const userExist = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username || dto.email }],
    });

    if (userExist) {
      throw new ConflictException("Email yoki Username allaqachon band!");
    }

    const hashedPassword = await this.hashPassword(dto.password);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    try {
      const newUser = this.userRepository.create({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        isActive: false,
        otpCode,
        otpExpires,
      });
      await this.userRepository.save(newUser);
      await this.mailService.sendOtpEmail(dto.email, otpCode);

      return {
        success: true,
        message: "Muvaffaqiyatli ro'yxatdan o'tildi. Tasdiqlash kodi emailga yuborildi",
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw new InternalServerErrorException("Ro'yxatdan o'tishda kutilmagan xatolik yuz berdi");
    }
  }

  // 2. LOGIN
  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ["id", "email", "password", "isActive", "role", "firstName", "lastName"],
    });

    if (!user || !user.password) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException("Email yoki parol noto'g'ri");

    if (!user.isActive) {
      throw new UnauthorizedException("Iltimos, avval hisobingizni tasdiqlang");
    }

    const tokens = await this.getTokens(user.id, user.email, user.role);

    await this.userService.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      success: true,
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  // 3. VERIFY OTP
  async verify(dto: VerifyOtpDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");
    if (user.isActive) return { success: true, message: "Hisobingiz allaqachon tasdiqlangan" };

    if (String(user.otpCode) !== String(dto.otpCode)) throw new BadRequestException("Tasdiqlash kodi noto'g'ri");

    const currentTime = new Date();
    if (user.otpExpires && currentTime > user.otpExpires) {
      throw new BadRequestException("Tasdiqlash kodining muddati tugagan");
    }

    await this.userRepository.update(user.id, {
      isActive: true,
      otpCode: null,
      otpExpires: null,
    });

    return { success: true, message: "Hisobingiz muvaffaqiyatli tasdiqlandi." };
  }

  // 4. FORGOT PASSWORD
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (user) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

      await this.userRepository.update(user.id, { otpCode, otpExpires });
      await this.mailService.sendOtpEmail(dto.email, otpCode);
    }

    return {
      success: true,
      message: "Agar ushbu email mavjud bo'lsa, tiklash kodi yuborildi.",
    };
  }

  // 5. RESET PASSWORD
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

    if (user.otpCode !== dto.otpCode) throw new UnauthorizedException("Kod noto'g'ri");

    if (user.otpExpires && new Date() > user.otpExpires) {
      throw new BadRequestException("Kodning muddati tugagan");
    }

    const hashedPassword = await this.hashPassword(dto.newPassword);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      otpCode: null,
      otpExpires: null,
    });

    return { success: true, message: "Parolingiz muvaffaqiyatli yangilandi" };
  }

  // 6. RESEND OTP
  async resendOtp(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");

    const currentTime = new Date();
    if (user.otpExpires && user.otpExpires.getTime() - currentTime.getTime() > 4 * 60 * 1000) {
      throw new BadRequestException("Iltimos, qayta yuborish uchun biroz kuting");
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await this.userRepository.update(user.id, { otpCode, otpExpires });
    await this.mailService.sendOtpEmail(email, otpCode);

    return { success: true, message: "Yangi tasdiqlash kodi emailga yuborildi" };
  }

  // 8. LOGOUT
  async logout(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("Foydalanuvchi topilmadi");
    }

    await this.userService.updateRefreshToken(userId, null);

    return {
      success: true,
      message: "Tizimdan muvaffaqiyatli chiqdingiz. Seans yakunlandi.",
    };
  }

  // 7. GOOGLE
  async googleLogin(userData: any) {
    const user = await this.userService.findOrCreate(userData);

    const tokens = await this.getTokens(user.id, user.email, user.role);

    await this.userService.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      success: true,
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // PRIVATE HELPER
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
