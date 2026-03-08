import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Vacancy } from "../../vacancies/entities/vacancy.entity";

@Unique(["userId", "vacancyId"])
@Entity("favourites")
export class Favourite {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.favourites, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "user_id" })
  userId: string;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.favourites, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "vacancy_id" })
  vacancy: Vacancy;

  @Column({ name: "vacancy_id" })
  vacancyId: string;

  @CreateDateColumn()
  createdAt: Date;
}
