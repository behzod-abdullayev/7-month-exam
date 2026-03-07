import { IsString, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({ example: "EskiParol123!" })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: "YangiKuchliParol777!" })
  @IsString()
  @MinLength(8, { message: "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak" })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Yangi parol juda kuchsiz (katta harf, kichik harf va raqam bo'lishi shart)",
  })
  newPassword: string;
}
