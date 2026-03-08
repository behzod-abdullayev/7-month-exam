import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Company } from "../../companies/entities/company.entity";
import { Vacancy } from "../../vacancies/entities/vacancy.entity";
import { Resume } from "../../resumes/entities/resume.entity";

@Entity("locations")
export class Location {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  region: string;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  lat: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  lng: number;

  @OneToMany(() => Company, (company) => company.location)
  companies: Company[];

  @OneToMany(() => Vacancy, (vacancy) => vacancy.location)
  vacancies: Vacancy[];

  @OneToMany(() => Resume, (resume) => resume.location)
  resumes: Resume[];

  @CreateDateColumn()
  createdAt: Date;
}
