import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLocationDto {
  @ApiProperty({ example: 'Toshkent shahri' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Toshkent' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ example: 41.2995 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lat?: number;

  @ApiPropertyOptional({ example: 69.2401 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  lng?: number;
}