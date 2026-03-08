import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { User } from "../users/entities/user.entity";
import { Company } from "../companies/entities/company.entity";
import { Vacancy } from "../vacancies/entities/vacancy.entity";
import { Application } from "../applications/entities/application.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Company, Vacancy, Application])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
