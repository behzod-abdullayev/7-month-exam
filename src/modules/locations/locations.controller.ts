import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { LocationsService } from "./locations.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("Locations")
@Controller("locations")
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // Barcha locationlar
  @Get()
  @ApiOperation({ summary: "Barcha joylashuvlarni olish" })
  findAll() {
    return this.locationsService.findAll();
  }

  // Viloyat bo'yicha filter
  @Get("by-region")
  @ApiOperation({ summary: "Viloyat bo'yicha joylashuvlarni olish" })
  @ApiQuery({ name: "region", example: "Toshkent", required: true })
  findByRegion(@Query("region") region: string) {
    return this.locationsService.findByRegion(region);
  }

  // Koordinatadan manzil olish (Yandex)
  @Get("reverse-geocode")
  @ApiOperation({ summary: "Koordinatalardan manzil olish (Yandex Maps)" })
  @ApiQuery({ name: "lat", example: 41.2995, required: true })
  @ApiQuery({ name: "lng", example: 69.2401, required: true })
  reverseGeocode(@Query("lat") lat: number, @Query("lng") lng: number) {
    return this.locationsService.reverseGeocode(lat, lng);
  }

  // Manzildan koordinata olish (Yandex)
  @Get("geocode")
  @ApiOperation({ summary: "Manzildan koordinatalar olish (Yandex Maps)" })
  @ApiQuery({ name: "address", example: "Toshkent, Chilonzor", required: true })
  geocode(@Query("address") address: string) {
    return this.locationsService.geocode(address);
  }

  // Bitta location
  @Get(":id")
  @ApiOperation({ summary: "Bitta joylashuvni ID orqali olish" })
  findOne(@Param("id") id: string) {
    return this.locationsService.findOne(id);
  }

  // Yangi location qo'shish
  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Yangi joylashuv qo'shish" })
  create(@Body() dto: CreateLocationDto) {
    return this.locationsService.create(dto);
  }

  // O'zbekiston viloyatlarini seed qilish
  @Post("seed/uzbekistan")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "O'zbekiston viloyatlarini DB ga qo'shish (bir marta)" })
  seedUzbekistan() {
    return this.locationsService.seedUzbekistanLocations();
  }

  // O'chirish
  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Joylashuvni o'chirish" })
  remove(@Param("id") id: string) {
    return this.locationsService.remove(id);
  }
}
