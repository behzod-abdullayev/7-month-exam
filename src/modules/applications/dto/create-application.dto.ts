import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateApplicationDto {
  @ApiProperty({ example: "uuid-of-vacancy" })
  @IsUUID()
  vacancyId: string;

  @ApiPropertyOptional({ example: "uuid-of-resume" })
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (value === "" ? null : value))
  resumeId?: string;

  @ApiPropertyOptional({ example: "Ushbu lavozim uchun..." })
  @IsOptional()
  @IsString()
  coverLetter?: string;
}
