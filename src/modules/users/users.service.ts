import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 1. GET ME

async findOne(id: string): Promise<User> {
  console.log("Qidirilayotgan ID:", id);

  const user = await this.userRepository.findOne({
    where: { id },
    select: [
      "id", 
      "email", 
      "username",
      "firstName", 
      "lastName", 
      "avatar", 
      "role", 
      "createdAt"
    ],
  });

  if (!user) {
    console.log("Foydalanuvchi topilmadi!");
    throw new NotFoundException("Foydalanuvchi topilmadi");
  }
  
  return user;
}
  // 2. UPDATE PROFILE
  async updateProfile(id: string, dto: UpdateProfileDto, filename?: string): Promise<User> {
    const user = await this.findOne(id);

    if (filename) {
      user.avatar = filename;
    }

    Object.assign(user, dto);

    return await this.userRepository.save(user);
  }


  //3. CHANGE PASSWORD
  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ["id", "password"],
    });

    if (!user) {
      throw new NotFoundException("Foydalanuvchi topilmadi");
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, user.password!);
    if (!isMatch) {
      throw new BadRequestException("Eski parol noto'g'ri kiritildi");
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(dto.newPassword, salt);

    return await this.userRepository.save(user);
  }
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const result = await this.userRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException("O'chirish uchun foydalanuvchi topilmadi");
    }

    return { success: true, message: "Profil muvaffaqiyatli o'chirildi" };
  }
}
