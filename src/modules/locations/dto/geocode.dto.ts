import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class ReverseGeocodeDto {
  @ApiProperty({ example: 41.2995 })
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @ApiProperty({ example: 69.2401 })
  @IsNumber()
  @Type(() => Number)
  lng: number;
}

export class GeocodeDto {
  @ApiProperty({ example: "Toshkent, Chilonzor tumani" })
  @IsString()
  @IsNotEmpty()
  address: string;
}
