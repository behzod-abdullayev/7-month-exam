import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ example: "bekzod2366@gmail.com" })
  @IsEmail({}, { message: "Email formati noto'g'ri" })
  @IsNotEmpty({ message: "Email kiritish shart" })
  email: string;
}
