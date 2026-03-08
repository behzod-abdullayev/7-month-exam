import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { LocationsService } from "./locations.service";
import { LocationsController } from "./locations.controller";
import { Location } from "./entities/location.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Location]), HttpModule, ConfigModule],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
