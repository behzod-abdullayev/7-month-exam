import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Transform } from "class-transformer";

export class VerifyOtpDto {
  @ApiProperty({ example: "bekzod2366@gmail.com" })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "123456" })
  @IsNotEmpty()
  @Transform(({ value }) => String(value))
  @IsString()
  @Length(6, 6, { message: "OTP kod 6 ta raqamdan iborat bo'lishi kerak" })
  otpCode: string;
}
