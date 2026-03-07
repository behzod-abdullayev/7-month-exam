import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  @IsNotEmpty({ message: "Email kiritish shart" })
  email: string;
}