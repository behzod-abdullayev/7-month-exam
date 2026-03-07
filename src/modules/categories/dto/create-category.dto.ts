import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({example: "IT va dasturlash"})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: "👨‍💻"})
    @IsString()
    @IsOptional()
    icon: string;

    @ApiProperty({example: "qizil"})
    @IsString()
    @IsOptional()
    color: string;
}
