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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { ResumesService } from "./resumes.service";
import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@ApiTags("Resumes")
@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  // PUBLIC
  @Get()
  @ApiOperation({ summary: "Barcha aktiv rezyumeler" })
  findAll(@Query("page") page = 1, @Query("limit") limit = 10) {
    return this.resumesService.findAll(+page, +limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Rezyumeni ID bo'yicha olish" })
  @ApiParam({ name: "id", type: String })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.resumesService.findOne(id);
  }

  // AUTH REQUIRED
  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.JOB_SEEKER, Role.ADMIN)
  @ApiOperation({ summary: "Yangi rezyume yaratish" })
  create(@Body() dto: CreateResumeDto, @CurrentUser() currentUser: User) {
    return this.resumesService.create(dto, currentUser);
  }

  @Get("my/list")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Mening rezyumelerim" })
  findMyResumes(@CurrentUser() currentUser: User) {
    return this.resumesService.findMyResumes(currentUser.id);
  }

  @Patch(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Rezyumeni yangilash" })
  @ApiParam({ name: "id", type: String })
  update(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateResumeDto, @CurrentUser() currentUser: User) {
    return this.resumesService.update(id, dto, currentUser);
  }

  @Delete(":id")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rezyumeni o'chirish" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() currentUser: User) {
    return this.resumesService.remove(id, currentUser);
  }
}
