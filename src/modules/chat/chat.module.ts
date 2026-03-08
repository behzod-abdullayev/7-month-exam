import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/message.entity';
import { ChatRoom } from './entities/room.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, ChatRoom, User]),
    JwtModule.register({}),
  ],
  controllers: [ChatController], 
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}