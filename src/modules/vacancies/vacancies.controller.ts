import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

import { VacanciesService } from "./vacancies.service";
import { CreateVacancyDto } from "./dto/create-vacancy.dto";
import { UpdateVacancyDto } from "./dto/update-vacancy.dto";
import { FilterVacancyDto } from "./dto/filter-vacancy.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { VacancyStatus } from "./entities/vacancy.entity";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@ApiTags("Vacancies")
@Controller("vacancies")
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  // PUBLIC
  @Get()
  @ApiOperation({ summary: "Barcha aktiv vakansiyalar (filter + pagination)" })
  findAll(@Query() filter: FilterVacancyDto) {
    return this.vacanciesService.findAll(filter);
  }

  @Get(":id")
  @ApiOperation({ summary: "Vakansiyani ID bo'yicha olish" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.vacanciesService.findOne(id);
  }

  // EMPLOYER / ADMIN
  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: "Yangi vakansiya yaratish" })
  create(@Body() dto: CreateVacancyDto, @CurrentUser() currentUser: User) {
    return this.vacanciesService.create(dto, currentUser);
  }

  @Get("my/list")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: "O'zimning vakansiyalarim" })
  findMyVacancies(@CurrentUser() currentUser: User, @Query() filter: FilterVacancyDto) {
    return this.vacanciesService.findMyVacancies(currentUser.id, filter);
  }

  @Patch(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: "Vakansiyani yangilash" })
  @ApiParam({ name: "id", type: String })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateVacancyDto, @CurrentUser() currentUser: User) {
    return this.vacanciesService.update(id, dto, currentUser);
  }

  @Patch(":id/status")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @ApiOperation({ summary: "Vakansiya statusini o'zgartirish" })
  @ApiParam({ name: "id", type: String })
  @ApiQuery({ name: "status", enum: VacancyStatus })
  changeStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("status") status: VacancyStatus,
    @CurrentUser() currentUser: User,
  ) {
    return this.vacanciesService.changeStatus(id, status, currentUser);
  }

  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYER, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Vakansiyani o'chirish" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() currentUser: User) {
    return this.vacanciesService.remove(id, currentUser);
  }
}
