import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsUUID,
  IsUrl,
  Min,
  MinLength,
  MaxLength,
} from "class-validator";
import { Type, Transform } from "class-transformer";
import { EducationLevel, WorkExperience, ResumeStatus } from "../entities/resume.entity";

export class CreateResumeDto {
  @ApiProperty({ example: "Senior Backend Developer" })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({ example: "Tajribali backend dasturchi..." })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ enum: EducationLevel })
  @IsOptional()
  @IsEnum(EducationLevel)
  educationLevel?: EducationLevel;

  @ApiPropertyOptional({ enum: WorkExperience })
  @IsOptional()
  @IsEnum(WorkExperience)
  workExperience?: WorkExperience;

  @ApiPropertyOptional({ enum: ResumeStatus })
  @IsOptional()
  @IsEnum(ResumeStatus)
  status?: ResumeStatus;

  @ApiPropertyOptional({ example: 3000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expectedSalaryMin?: number;

  @ApiPropertyOptional({ example: 8000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  expectedSalaryMax?: number;

  @ApiPropertyOptional({ example: "UZS" })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: "https://portfolio.com" })
  @IsOptional()
  @IsString()
  portfolioUrl?: string;

  @ApiPropertyOptional({ example: "https://github.com/username" })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiPropertyOptional({ example: "https://linkedin.com/in/username" })
  @IsOptional()
  @IsString()
  linkedinUrl?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isOpenToWork?: boolean;

  @ApiPropertyOptional({ example: "uuid-of-location" })
  @IsOptional()
  @IsUUID()
  @Transform(({ value }) => (value === "" ? null : value))
  locationId?: string;

  @ApiPropertyOptional({ example: ["uuid-skill-1", "uuid-skill-2"] })
  @IsOptional()
  @IsArray()
  @IsUUID("all", { each: true })
  skillIds?: string[];
}
