import { Gender, Role } from "src/common/enums/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ unique: true, nullable: true })
  googleId: string;

  @Column({ unique: true, nullable: true })
  githubId: string;

  @Column({ type: "enum", enum: Gender, default: Gender.OTHER })
  gender: Gender;

  @Column({ type: "enum", enum: Role, default: Role.JOB_SEEKER })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
