import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ApplicationsService } from "./applications.service";
import { ApplicationsController } from "./applications.controller";
import { Application } from "./entities/application.entity";
import { Vacancy } from "../vacancies/entities/vacancy.entity";
import { Resume } from "../resumes/entities/resume.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Application, Vacancy, Resume, User])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
