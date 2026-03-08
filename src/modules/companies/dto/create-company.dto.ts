import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional, IsUrl, IsEmail, IsEnum, IsNumber, Min, Max, IsUUID } from "class-validator";
import { Transform, Type } from "class-transformer";
import { CompanySize, CompanyType } from "../entities/company.entity";

export class CreateCompanyDto {
  @ApiProperty({ example: "Najot Ta'lim" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: "O'zbekistondagi yetakchi IT ta'lim markazi" })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: "https://najotstudy.uz" })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ example: "+998901234567" })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: "info@najotstudy.uz" })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ enum: CompanyType, example: CompanyType.PRIVATE })
  @IsEnum(CompanyType)
  @IsOptional()
  type?: CompanyType;

  @ApiPropertyOptional({ enum: CompanySize, example: CompanySize.MEDIUM })
  @IsEnum(CompanySize)
  @IsOptional()
  size?: CompanySize;

  @ApiPropertyOptional({ example: 2015 })
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  @IsOptional()
  @Type(() => Number)
  foundedYear?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({ type: "string", format: "binary" })
  @IsOptional()
  logo?: any;
}
