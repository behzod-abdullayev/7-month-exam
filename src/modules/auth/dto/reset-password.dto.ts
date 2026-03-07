import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, Matches, IsEmail, Length } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ example: "bekzod2366@gmail.com", description: "Foydalanuvchi emaili" })
  @IsEmail({}, { message: "Email noto'g'ri formatda" })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "123456", description: "Emailga yuborilgan 6 xonali OTP kod" })
  @IsString()
  @Length(6, 6, { message: "OTP kod 6 ta raqamdan iborat bo'lishi kerak" })
  otpCode: string;

  @ApiProperty({ example: "NewPassword123!", minLength: 8 })
  @IsString()
  @MinLength(8, { message: "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Yangi parol juda kuchsiz (Katta harf, kichik harf va raqam bo'lishi shart)",
  })
  newPassword: string;

  @ApiProperty({ example: "NewPassword123!", description: "Yangi parolni tasdiqlash" })
  @IsString()
  @IsNotEmpty({ message: "Parolni tasdiqlash maydoni bo'sh bo'lmasligi kerak" })
  confirmPassword: string;
}
