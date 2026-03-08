import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Vacancy } from "../../vacancies/entities/vacancy.entity";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  color: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Vacancy, (vacancy) => vacancy.category)
  vacancies: Vacancy[];

  @CreateDateColumn()
  createdAt: Date;
}
