import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
}

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  content: string;

  @Column({ type: "enum", enum: MessageStatus, default: MessageStatus.SENT })
  status: MessageStatus;

  @Column({ default: false })
  isEdited: boolean;

  @ManyToOne(() => User, (user) => user.sentMessages, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @Column({ name: "sender_id" })
  senderId: string;

  @ManyToOne(() => User, (user) => user.receivedMessages, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "receiver_id" })
  receiver: User;

  @Column({ name: "receiver_id" })
  receiverId: string;

  @Column()
  roomId: string;

  @CreateDateColumn()
  createdAt: Date;
}
