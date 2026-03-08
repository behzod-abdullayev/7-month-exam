import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsUUID, IsInt, Min, Max, IsOptional, IsString, IsBoolean } from "class-validator";

export class CreateReviewDto {
  @ApiProperty({ example: "uuid-of-company" })
  @IsUUID()
  companyId: string;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: "Yaxshi kompaniya..." })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ example: "Yaxshi jamoa, remote work" })
  @IsOptional()
  @IsString()
  pros?: string;

  @ApiPropertyOptional({ example: "Maosh past" })
  @IsOptional()
  @IsString()
  cons?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
