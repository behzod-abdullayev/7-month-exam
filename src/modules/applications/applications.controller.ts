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

import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@ApiTags("Applications")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.JOB_SEEKER)
  @ApiOperation({ summary: "Vakansiyaga ariza yuborish (Job Seeker)" })
  create(@Body() dto: CreateApplicationDto, @CurrentUser() currentUser: User) {
    return this.applicationsService.create(dto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: "Arizalar ro'yxati (o'zining)" })
  @ApiQuery({ name: "vacancyId", required: false, type: String })
  findAll(@CurrentUser() currentUser: User, @Query("vacancyId") vacancyId?: string) {
    return this.applicationsService.findAll(currentUser, vacancyId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Arizani ID bo'yicha olish" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() currentUser: User) {
    return this.applicationsService.findOne(id, currentUser);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Ariza statusini yangilash" })
  @ApiParam({ name: "id", type: String })
  updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateApplicationDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.applicationsService.updateStatus(id, dto, currentUser);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Arizani o'chirish" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() currentUser: User) {
    return this.applicationsService.remove(id, currentUser);
  }
}
