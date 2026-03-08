import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from "typeorm";
import { Vacancy } from "../../vacancies/entities/vacancy.entity";
import { Resume } from "../../resumes/entities/resume.entity";

@Entity("skills")
export class Skill {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Vacancy, (vacancy) => vacancy.skills)
  vacancies: Vacancy[];

  @ManyToMany(() => Resume, (resume) => resume.skills)
  resumes: Resume[];

  @CreateDateColumn()
  createdAt: Date;
}
