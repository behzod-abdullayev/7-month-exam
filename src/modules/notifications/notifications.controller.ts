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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

import { NotificationsService } from "./notifications.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { User } from "../users/entities/user.entity";

@ApiTags("Notifications")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: "Mening bildirishnomalarim" })
  findMy(@CurrentUser() currentUser: User, @Query("page") page = 1, @Query("limit") limit = 20) {
    return this.notificationsService.findMy(currentUser.id, +page, +limit);
  }

  @Patch(":id/read")
  @ApiOperation({ summary: "Bildirishnomani o'qilgan deb belgilash" })
  @ApiParam({ name: "id", type: String })
  markAsRead(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() currentUser: User) {
    return this.notificationsService.markAsRead(id, currentUser);
  }

  @Patch("read-all")
  @ApiOperation({ summary: "Hammasini o'qilgan deb belgilash" })
  markAllAsRead(@CurrentUser() currentUser: User) {
    return this.notificationsService.markAllAsRead(currentUser.id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Bildirishnomani o'chirish" })
  @ApiParam({ name: "id", type: String })
  remove(@Param("id", ParseUUIDPipe) id: string, @CurrentUser() currentUser: User) {
    return this.notificationsService.remove(id, currentUser);
  }
}
