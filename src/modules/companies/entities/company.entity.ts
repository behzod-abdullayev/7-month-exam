import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Location } from "../../locations/entities/location.entity";
import { Vacancy } from "../../vacancies/entities/vacancy.entity";
import { Review } from "../../rewiews/entities/review.entity";

export enum CompanySize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  ENTERPRISE = "enterprise",
}

export enum CompanyType {
  PRIVATE = "private",
  STATE = "state",
  INTERNATIONAL = "international",
  STARTUP = "startup",
}

@Entity("companies")
export class Company {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: "enum", enum: CompanyType, default: CompanyType.PRIVATE })
  type: CompanyType;

  @Column({ type: "enum", enum: CompanySize, default: CompanySize.SMALL })
  size: CompanySize;

  @Column({ nullable: true })
  foundedYear: number;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.companies, { nullable: false })
  @JoinColumn({ name: "owner_id" })
  owner: User;

  @Column({ name: "owner_id" })
  ownerId: string;

  @ManyToOne(() => Location, (location) => location.companies, { nullable: true, eager: true })
  @JoinColumn({ name: "location_id" })
  location: Location;

  @Column({ name: "location_id", nullable: true })
  locationId: string;

  @OneToMany(() => Vacancy, (vacancy) => vacancy.company)
  vacancies: Vacancy[];

  @OneToMany(() => Review, (review) => review.company)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
