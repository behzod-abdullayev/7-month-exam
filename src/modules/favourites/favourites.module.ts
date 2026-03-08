import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FavouritesService } from "./favourites.service";
import { FavouritesController } from "./favourites.controller";
import { Favourite } from "./entities/favourite.entity";
import { Vacancy } from "../vacancies/entities/vacancy.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Favourite, Vacancy, User])],
  controllers: [FavouritesController],
  providers: [FavouritesService],
  exports: [FavouritesService],
})
export class FavouritesModule {}
