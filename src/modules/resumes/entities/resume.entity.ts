import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  OneToMany,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Skill } from "../../skills/entities/skill.entity";
import { Location } from "../../locations/entities/location.entity";
import { Application } from "../../applications/entities/application.entity";

export enum EducationLevel {
  SECONDARY = "secondary",
  BACHELOR = "bachelor",
  MASTER = "master",
  PHD = "phd",
  VOCATIONAL = "vocational",
}

export enum WorkExperience {
  NO_EXPERIENCE = "no_experience",
  LESS_THAN_1 = "less_than_1",
  FROM_1_TO_3 = "from_1_to_3",
  FROM_3_TO_5 = "from_3_to_5",
  MORE_THAN_5 = "more_than_5",
}

export enum ResumeStatus {
  ACTIVE = "active",
  HIDDEN = "hidden",
  DRAFT = "draft",
}

@Entity("resumes")
export class Resume {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  summary: string;

  @Column({ type: "enum", enum: EducationLevel, nullable: true })
  educationLevel: EducationLevel;

  @Column({ type: "enum", enum: WorkExperience, default: WorkExperience.NO_EXPERIENCE })
  workExperience: WorkExperience;

  @Column({ type: "enum", enum: ResumeStatus, default: ResumeStatus.ACTIVE })
  status: ResumeStatus;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  expectedSalaryMin: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  expectedSalaryMax: number;

  @Column({ type: "varchar", default: "UZS" })
  currency: string;

  @Column({ nullable: true })
  portfolioUrl: string;

  @Column({ nullable: true })
  githubUrl: string;

  @Column({ nullable: true })
  linkedinUrl: string;

  @Column({ nullable: true })
  cvFileUrl: string;

  @Column({ default: false })
  isOpenToWork: boolean;

  @ManyToOne(() => User, (user) => user.resumes, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => Location, (location) => location.resumes, { nullable: true, eager: true })
  @JoinColumn({ name: "location_id" })
  location: Location;

  @Column({ name: "location_id", nullable: true })
  locationId: string | null;

  @ManyToMany(() => Skill, (skill) => skill.resumes, { eager: true })
  @JoinTable({
    name: "resume_skills",
    joinColumn: { name: "resume_id" },
    inverseJoinColumn: { name: "skill_id" },
  })
  skills: Skill[];

  @OneToMany(() => Application, (app) => app.resume)
  applications: Application[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
