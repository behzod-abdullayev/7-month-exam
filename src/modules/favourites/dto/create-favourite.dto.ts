import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateFavouriteDto {
  @ApiProperty({ example: "uuid-of-vacancy" })
  @IsUUID()
  vacancyId: string;
}
