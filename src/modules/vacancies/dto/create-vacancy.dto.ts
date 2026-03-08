import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsArray,
  IsUUID,
  Min,
  MaxLength,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { JobType, ExperienceLevel, VacancyStatus, SalaryType } from "../entities/vacancy.entity";

export class CreateVacancyDto {
  @ApiProperty({ example: "Senior Backend Developer" })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  title: string;

  @ApiProperty({ example: "We are looking for a skilled backend developer..." })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  responsibilities?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  benefits?: string;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @ApiPropertyOptional({ example: 10000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salaryMax?: number;

  @ApiPropertyOptional({ example: "UZS" })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ enum: SalaryType, default: SalaryType.MONTHLY })
  @IsOptional()
  @IsEnum(SalaryType)
  salaryType?: SalaryType;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  salaryNegotiable?: boolean;

  @ApiProperty({ enum: JobType })
  @IsEnum(JobType)
  jobType: JobType;

  @ApiProperty({ enum: ExperienceLevel })
  @IsEnum(ExperienceLevel)
  experienceLevel: ExperienceLevel;

  @ApiPropertyOptional({ enum: VacancyStatus, default: VacancyStatus.ACTIVE })
  @IsOptional()
  @IsEnum(VacancyStatus)
  status?: VacancyStatus;

  @ApiPropertyOptional({ example: "2025-12-31" })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiProperty({ example: "uuid-of-company" })
  @IsUUID()
  companyId: string;

  @ApiPropertyOptional({ example: "uuid-of-location" })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({ example: "uuid-of-category" })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: ["uuid-skill-1", "uuid-skill-2"] })
  @IsOptional()
  @IsArray()
  @IsUUID("all", { each: true })
  skillIds?: string[];
}
