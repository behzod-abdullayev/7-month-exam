import { Gender, Role } from "src/common/enums/role.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Index, OneToMany } from "typeorm";
import { Company } from '../../companies/entities/company.entity';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';
import { Resume } from '../../resumes/entities/resume.entity';
import { Application } from '../../applications/entities/application.entity';
import { Favourite } from '../../favourites/entities/favourite.entity';
import { Review } from '../../rewiews/entities/review.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Message } from '../../chat/entities/message.entity';

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ type: "varchar", unique: true })
  username: string;

  @Index({ unique: true })
  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", select: false, nullable: true })
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

  @OneToMany(() => Company, (company) => company.owner)
  companies: Company[];

  @OneToMany(() => Vacancy, (vacancy) => vacancy.postedBy)
  vacancies: Vacancy[];

  @OneToMany(() => Resume, (resume) => resume.user)
  resumes: Resume[];

  @OneToMany(() => Application, (app) => app.user)
  applications: Application[];

  @OneToMany(() => Favourite, (fav) => fav.user)
  favourites: Favourite[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Notification, (notif) => notif.user)
  notifications: Notification[];

  @OneToMany(() => Message, (msg) => msg.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (msg) => msg.receiver)
  receivedMessages: Message[];
}