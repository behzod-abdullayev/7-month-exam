import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum NotificationType {
  APPLICATION_RECEIVED = "application_received",
  APPLICATION_STATUS = "application_status",
  VACANCY_MATCH = "vacancy_match",
  REVIEW_RECEIVED = "review_received",
  SYSTEM = "system",
}

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: NotificationType, default: NotificationType.SYSTEM })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: "text" })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => User, (user) => user.notifications, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id" })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
