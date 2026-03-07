import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'Behzod_001', 
    description: 'Email manzili yoki Username' 
  })
  @IsString()
  @IsNotEmpty({ message: "Login kiritish majburiy (email yoki username)" })
  email: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'Foydalanuvchi paroli' 
  })
  @IsString()
  @IsNotEmpty({ message: "Parol kiritish majburiy" })
  password: string;
}