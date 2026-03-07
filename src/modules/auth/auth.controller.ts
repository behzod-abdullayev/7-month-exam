import { Controller, Post, Body, Get, UseGuards, Req, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { ResendOtpDto } from "./dto/resend-otp.dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

@ApiTags("Authentication")
@Controller("auth")
@ApiBearerAuth('JWT-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Yangi foydalanuvchini ro'yxatdan o'tkazish" })
  @ApiResponse({ status: 201, description: "Muvaffaqiyatli ro'yxatdan o'tkazildi" })
  @ApiResponse({ status: 400, description: "Ma'lumot xato yuborilgan" })
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Tizimga kirish (Login)" })
  async login(@Body() dto: LoginDto) {
    return await this.authService.login(dto);
  }

  @Post("verify")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Emailni OTP kod orqali tasdiqlash" })
  async verify(@Body() dto: VerifyOtpDto) {
    return await this.authService.verify(dto);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Parolni tiklash uchun so'rov (OTP yuborish)" })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Yangi parolni tasdiqlash va saqlash" })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  @Post("resend-otp")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "OTP kodni qayta yuborish" })
  async resendOtp(@Body() dto: ResendOtpDto) {
    return await this.authService.resendOtp(dto.email);
  }

  @Post("logout")
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Tizimdan chiqish" })
  logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  //google
  @Get("google")
  @UseGuards(AuthGuard("google"))
  authGoogle() {}

  @Get("google/callback")
  @ApiOperation({ summary: "Google callback" })
  googleCallback(@Req() req: any) {
    return this.authService.googleLogin(req.user);
  }

  // --- GITHUB ---
  @Get("github")
  @UseGuards(AuthGuard("github"))
  authGithub() {}

  @Get("github/callback")
  @UseGuards(AuthGuard("github"))
  githubRedirect(@Req() req: any) {
    return this.authService.googleLogin(req.user);
  }
}
