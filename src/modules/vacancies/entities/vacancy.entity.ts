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
  Index,
  OneToMany,
} from "typeorm";
import { Company } from "../../companies/entities/company.entity";
import { Location } from "../../locations/entities/location.entity";
import { User } from "../../users/entities/user.entity";
import { Skill } from "../../skills/entities/skill.entity";
import { Category } from "../../categories/entities/category.entity";
import { Application } from "../../applications/entities/application.entity";
import { Favourite } from "../../favourites/entities/favourite.entity";

export enum JobType {
  FULL_TIME = "full_time",
  PART_TIME = "part_time",
  REMOTE = "remote",
  HYBRID = "hybrid",
  INTERNSHIP = "internship",
  CONTRACT = "contract",
}

export enum ExperienceLevel {
  JUNIOR = "junior",
  MIDDLE = "middle",
  SENIOR = "senior",
  LEAD = "lead",
  NO_EXPERIENCE = "no_experience",
}

export enum VacancyStatus {
  ACTIVE = "active",
  CLOSED = "closed",
  DRAFT = "draft",
  ARCHIVED = "archived",
}

export enum SalaryType {
  MONTHLY = "monthly",
  HOURLY = "hourly",
  FIXED = "fixed",
}

@Entity("vacancies")
export class Vacancy {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index()
  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text", nullable: true })
  requirements: string;

  @Column({ type: "text", nullable: true })
  responsibilities: string;

  @Column({ type: "text", nullable: true })
  benefits: string;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  salaryMin: number;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  salaryMax: number;

  @Column({ type: "varchar", default: "UZS" })
  currency: string;

  @Column({ type: "enum", enum: SalaryType, default: SalaryType.MONTHLY })
  salaryType: SalaryType;

  @Column({ default: false })
  salaryNegotiable: boolean;

  @Column({ type: "enum", enum: JobType, default: JobType.FULL_TIME })
  jobType: JobType;

  @Column({ type: "enum", enum: ExperienceLevel, default: ExperienceLevel.JUNIOR })
  experienceLevel: ExperienceLevel;

  @Column({ type: "enum", enum: VacancyStatus, default: VacancyStatus.ACTIVE })
  status: VacancyStatus;

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ nullable: true })
  deadline: Date;

  @ManyToOne(() => Company, (company) => company.vacancies, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "company_id" })
  company: Company;

  @Column({ name: "company_id" })
  companyId: string;

  @ManyToOne(() => User, (user) => user.vacancies, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "posted_by" })
  postedBy: User;

  @Column({ name: "posted_by" })
  postedById: string;

  @ManyToOne(() => Location, (location) => location.vacancies, { nullable: true, eager: true })
  @JoinColumn({ name: "location_id" })
  location: Location;

  @Column({ name: "location_id", nullable: true })
  locationId: string;

  @ManyToOne(() => Category, (category) => category.vacancies, { nullable: true, eager: true })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column({ name: "category_id", nullable: true })
  categoryId: string;

  @ManyToMany(() => Skill, (skill) => skill.vacancies, { eager: true })
  @JoinTable({
    name: "vacancy_skills",
    joinColumn: { name: "vacancy_id" },
    inverseJoinColumn: { name: "skill_id" },
  })
  skills: Skill[];

  @OneToMany(() => Application, (app) => app.vacancy)
  applications: Application[];

  @OneToMany(() => Favourite, (fav) => fav.vacancy)
  favourites: Favourite[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
