import {
  Controller, Get, Delete, Param,
  UseGuards, Query, ParseUUIDPipe, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms')
  @ApiOperation({ summary: 'Mening chat roomlarim' })
  getMyRooms(@CurrentUser() currentUser: User) {
    return this.chatService.getMyRooms(currentUser.id);
  }

  @Get('messages/:otherUserId')
  @ApiOperation({ summary: 'Xabarlar tarixi' })
  @ApiParam({ name: 'otherUserId', type: String })
  getMessages(
    @Param('otherUserId', ParseUUIDPipe) otherUserId: string,
    @CurrentUser() currentUser: User,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    return this.chatService.getMessages(currentUser.id, otherUserId, +page, +limit);
  }

  @Get('unread')
  @ApiOperation({ summary: 'O\'qilmagan xabarlar soni' })
  getUnreadCount(@CurrentUser() currentUser: User) {
    return this.chatService.getUnreadCount(currentUser.id);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xabarni o\'chirish' })
  @ApiParam({ name: 'id', type: String })
  deleteMessage(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.chatService.deleteMessage(id, currentUser.id);
  }
}