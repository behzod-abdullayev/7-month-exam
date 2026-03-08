import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { FavouritesService } from "./favourites.service";
import { CreateFavouriteDto } from "./dto/create-favourite.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@ApiTags("Favourites")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("favourites")
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Post()
  @ApiOperation({ summary: "Vakansiyani sevimlilariga qo'shish" })
  add(@Body() dto: CreateFavouriteDto, @CurrentUser() currentUser: User) {
    return this.favouritesService.add(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: "Mening sevimli vakansiyalarim" })
  findMy(@CurrentUser() currentUser: User) {
    return this.favouritesService.findMy(currentUser);
  }

  @Delete(":vacancyId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sevimlilardan o'chirish" })
  @ApiParam({ name: "vacancyId", type: String })
  remove(@Param("vacancyId", ParseUUIDPipe) vacancyId: string, @CurrentUser() currentUser: User) {
    return this.favouritesService.remove(vacancyId, currentUser);
  }
}
