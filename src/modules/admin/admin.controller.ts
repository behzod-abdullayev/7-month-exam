import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";

@ApiTags("Admin")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("stats")
  @ApiOperation({ summary: "Dashboard statistikasi" })
  getStats() {
    return this.adminService.getStats();
  }

  // USERS
  @Get("users")
  @ApiOperation({ summary: "Barcha foydalanuvchilar" })
  getAllUsers(@Query("page") page = 1, @Query("limit") limit = 20) {
    return this.adminService.getAllUsers(+page, +limit);
  }

  @Patch("users/:id/role")
  @ApiOperation({ summary: "Foydalanuvchi rolini o'zgartirish" })
  @ApiParam({ name: "id", type: String })
  @ApiQuery({ name: "role", enum: Role })
  changeUserRole(@Param("id", ParseUUIDPipe) id: string, @Query("role") role: Role) {
    return this.adminService.changeUserRole(id, role);
  }

  @Patch("users/:id/toggle-active")
  @ApiOperation({ summary: "Foydalanuvchini faollashtirish/bloklash" })
  @ApiParam({ name: "id", type: String })
  toggleUserActive(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.toggleUserActive(id);
  }

  @Delete("users/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Foydalanuvchini o'chirish" })
  @ApiParam({ name: "id", type: String })
  deleteUser(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }

  // COMPANIES
  @Get("companies")
  @ApiOperation({ summary: "Barcha kompaniyalar" })
  getAllCompanies(@Query("page") page = 1, @Query("limit") limit = 20) {
    return this.adminService.getAllCompanies(+page, +limit);
  }

  @Patch("companies/:id/verify")
  @ApiOperation({ summary: "Kompaniyani tasdiqlash" })
  @ApiParam({ name: "id", type: String })
  verifyCompany(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.verifyCompany(id);
  }

  @Delete("companies/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Kompaniyani o'chirish" })
  @ApiParam({ name: "id", type: String })
  deleteCompany(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.deleteCompany(id);
  }

  // VACANCIES
  @Get("vacancies")
  @ApiOperation({ summary: "Barcha vakansiyalar" })
  getAllVacancies(@Query("page") page = 1, @Query("limit") limit = 20) {
    return this.adminService.getAllVacancies(+page, +limit);
  }

  @Delete("vacancies/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Vakansiyani o'chirish" })
  @ApiParam({ name: "id", type: String })
  deleteVacancy(@Param("id", ParseUUIDPipe) id: string) {
    return this.adminService.deleteVacancy(id);
  }
}
