import { Gender, Role } from "src/common/enums/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ type: "varchar", unique: true }) // Type aniq ko'rsatildi
  username: string;

  @Index({ unique: true })
  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", select: false, nullable: true }) // 👈 null bo'lishi mumkin bo'lganlarga type shart
  password: string | null;

  @Column({ type: "varchar", nullable: true })
  firstName: string | null;

  @Column({ type: "varchar", nullable: true })
  lastName: string | null;

  @Column({ type: "varchar", nullable: true })
  avatarUrl: string | null;

  @Column({ type: "varchar", unique: true, nullable: true })
  googleId: string | null;

  @Column({ type: "varchar", unique: true, nullable: true })
  githubId: string | null;

  @Column({ type: "enum", enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column({ type: "enum", enum: Role, default: Role.JOB_SEEKER })
  role: Role;

  @Column({ type: "boolean", default: false })
  isActive: boolean;

  @Column({ type: "varchar", nullable: true })
  otpCode: string | null;

  @Column({ type: "timestamp", nullable: true, select: false })
  otpExpires: Date | null;

  @Column({ type: "varchar", nullable: true, select: false })
  resetPasswordToken: string | null;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phoneNumber: string; 

  @Column({ type: "varchar", nullable: true })
  refreshToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 
