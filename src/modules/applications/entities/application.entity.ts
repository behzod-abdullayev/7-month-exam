import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Vacancy } from "../../vacancies/entities/vacancy.entity";
import { Resume } from "../../resumes/entities/resume.entity";

export enum ApplicationStatus {
  PENDING = "pending",
  REVIEWED = "reviewed",
  INTERVIEW = "interview",
  OFFERED = "offered",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

@Unique(["userId", "vacancyId"])
@Entity("applications")
export class Application {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  @Column({ type: "text", nullable: true })
  coverLetter: string;

  @Column({ nullable: true })
  cvFileUrl: string;

  @Column({ type: "text", nullable: true })
  rejectionReason: string;

  @ManyToOne(() => User, (user) => user.applications, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "vacancy_id" })
  vacancy: Vacancy;

  @Column({ name: "vacancy_id" })
  vacancyId: string;

  @ManyToOne(() => Resume, (resume) => resume.applications, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "resume_id" })
  resume: Resume;

  @Column({ name: "resume_id", nullable: true })
  resumeId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
