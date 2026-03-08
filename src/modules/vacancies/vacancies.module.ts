import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { VacanciesService } from "./vacancies.service";
import { VacanciesController } from "./vacancies.controller";
import { Vacancy } from "./entities/vacancy.entity";
import { Company } from "../companies/entities/company.entity";
import { Skill } from "../skills/entities/skill.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Vacancy, Company, Skill, User])],
  controllers: [VacanciesController],
  providers: [VacanciesService],
  exports: [VacanciesService],
})
export class VacanciesModule {}
