import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength, ValidateIf } from "class-validator";
import { Gender, Role } from "src/common/enums/role.enum";

export class CreateUserDto {
  @ApiProperty({
    example: "bekzod2366@gmail.com",
    description: "foydalanuvchi emaili kaamida 8 ta belgidan iborat bolish kerak",
  })
  @IsEmail({}, { message: "email noto'ri formatda" })
  email: string;

  @ApiProperty({
    example: "Behzod@2366",
    required: false,
    description: "Kamida 8 ta belgi, 1 ta katta harf, 1 ta kichik harf va 1 ta raqam bo'lishi shart",
  })
  @ValidateIf((o) => !o.googleId && !o.githubId)
  @IsString()
  @MinLength(8, { message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  @Matches(/((?=.*[0-9])|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Parol juda kuchsiz! (Kamida 1 ta katta harf, 1 ta kichik harf va 1 ta raqam bo'lishi kerak)",
  })
  password?: string;

  @ApiProperty({ example: "behzod", required: false })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ example: "abdullayev", required: false })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ enum: Gender, default: Gender.OTHER })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ enum: Role, default: Role.JOB_SEEKER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  githubId?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
