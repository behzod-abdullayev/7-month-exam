import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Or, Equal } from "typeorm";

import { Message, MessageStatus } from "./entities/message.entity";
import { ChatRoom } from "./entities/room.entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(ChatRoom)
    private readonly roomRepo: Repository<ChatRoom>,
  ) {}

  // RoomId hosil qilish — ikki UUID sort qilinadi
  generateRoomId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join("_");
  }

  // Room topish yoki yaratish
  async getOrCreateRoom(userId1: string, userId2: string): Promise<ChatRoom> {
    const roomId = this.generateRoomId(userId1, userId2);

    let room = await this.roomRepo.findOne({ where: { roomId } });

    if (!room) {
      const [u1, u2] = [userId1, userId2].sort();
      room = this.roomRepo.create({
        roomId,
        user1Id: u1,
        user2Id: u2,
      });
      room = await this.roomRepo.save(room);
    }

    return room;
  }

  // Xabar saqlash
  async saveMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const roomId = this.generateRoomId(senderId, receiverId);

    // Room yangilash
    await this.roomRepo.update({ roomId }, { lastMessage: content, lastMessageAt: new Date() });

    const message = this.messageRepo.create({
      senderId,
      receiverId,
      content,
      roomId,
    });

    return this.messageRepo.save(message);
  }

  // Xabarlar tarixi
  async getMessages(userId: string, otherUserId: string, page = 1, limit = 50) {
    const roomId = this.generateRoomId(userId, otherUserId);

    const [data, total] = await this.messageRepo.findAndCount({
      where: { roomId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // O'qilgan deb belgilash
    await this.messageRepo.update(
      { roomId, receiverId: userId, status: MessageStatus.SENT },
      { status: MessageStatus.READ },
    );

    return {
      data: data.reverse(),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // Mening barcha roomlarim
  async getMyRooms(userId: string): Promise<ChatRoom[]> {
    return this.roomRepo.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      relations: ["user1", "user2"],
      order: { lastMessageAt: "DESC" },
    });
  }

  // O'qilmagan xabarlar soni
  async getUnreadCount(userId: string): Promise<number> {
    return this.messageRepo.count({
      where: { receiverId: userId, status: MessageStatus.SENT },
    });
  }

  // Xabarni o'chirish
  async deleteMessage(messageId: string, userId: string) {
    const message = await this.messageRepo.findOne({ where: { id: messageId } });
    if (!message) throw new NotFoundException("Xabar topilmadi");
    if (message.senderId !== userId) {
      throw new ForbiddenException("Faqat o'z xabaringizni o'chira olasiz");
    }
    await this.messageRepo.remove(message);
    return { success: true, message: "Xabar o'chirildi" };
  }
}
