import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("chat_rooms")
export class ChatRoom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  roomId: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user1_id" })
  user1: User;

  @Column({ name: "user1_id" })
  user1Id: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "user2_id" })
  user2: User;

  @Column({ name: "user2_id" })
  user2Id: string;

  @Column({ type: "text", nullable: true })
  lastMessage: string;

  @Column({ nullable: true })
  lastMessageAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
