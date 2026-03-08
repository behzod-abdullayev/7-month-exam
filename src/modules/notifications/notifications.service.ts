import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Notification, NotificationType } from "./entities/notification.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
  ) {}

  // Internal - boshqa servicelar ishlatadi
  async send(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<Notification> {
    const notif = this.notifRepo.create({ userId, type, title, message, metadata });
    return this.notifRepo.save(notif);
  }

  // O'zining bildirishnomalarini olish
  async findMy(userId: string, page = 1, limit = 20) {
    const [data, total] = await this.notifRepo.findAndCount({
      where: { userId },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const unreadCount = await this.notifRepo.count({
      where: { userId, isRead: false },
    });

    return {
      data,
      unreadCount,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // O'qilgan deb belgilash
  async markAsRead(id: string, currentUser: User) {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException("Bildirishnoma topilmadi");
    if (notif.userId !== currentUser.id) throw new ForbiddenException("Ruxsat yo'q");

    notif.isRead = true;
    return this.notifRepo.save(notif);
  }

  // Hammasini o'qilgan deb belgilash
  async markAllAsRead(userId: string) {
    await this.notifRepo.update({ userId, isRead: false }, { isRead: true });
    return { success: true, message: "Barcha bildirishnomalar o'qildi" };
  }

  // O'chirish
  async remove(id: string, currentUser: User) {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException("Bildirishnoma topilmadi");
    if (notif.userId !== currentUser.id) throw new ForbiddenException("Ruxsat yo'q");

    await this.notifRepo.remove(notif);
    return { success: true, message: "Bildirishnoma o'chirildi" };
  }
}
