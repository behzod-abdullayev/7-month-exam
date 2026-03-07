import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Gender } from "src/common/enums/role.enum";

export class RegisterDto {
  @ApiProperty({
    example: "Behzod_001",
    description: "Username faqat katta va kichik harf, raqam va pastki chiziqdan iborat bo'lishi mumkin",
    minLength: 3,
    maxLength: 25,
  })
  @IsString()
  @IsNotEmpty({ message: "Username bo'sh bo'lishi mumkin emas" })
  @MinLength(3, { message: "Usernameda kamida 3 ta belgi bo'lishi kerak" })
  @MaxLength(25, { message: "Usernameda maksimal 25 ta belgi bo'lishi mumkin" })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: "Username faqat harf, raqam va pastki chiziqdan iborat bo'lishi mumkin" })
  username: string;

  @ApiProperty({
    example: "user@gmail.com",
    description: "Foydalanuvchining asosiy email manzili",
  })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  @IsNotEmpty({ message: "Email majburiy" })
  email: string;

  @ApiProperty({
    example: "Password123!",
    description: "Maxfiy parol (kamida 8 ta belgi)",
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: "Parol majburiy" })
  @MinLength(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Parol juda kuchsiz (kamida 1 ta katta harf, son va belgi bo'lishi shart)",
  })
  password: string;
}


// import { IsEmail, IsNumber, IsString, Length } from "class-validator";

// export class CreateAuthDto {
//   @IsString({ message: "username string bo'lishi kerak" })
//   @Length(3, 50)
//   username: string;

//   @IsString()
//   @IsEmail()
//   email: string;

//   @IsString()
//   password: string;
// }
