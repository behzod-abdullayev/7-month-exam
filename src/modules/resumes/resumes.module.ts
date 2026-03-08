import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ResumesService } from "./resumes.service";
import { ResumesController } from "./resumes.controller";
import { Resume } from "./entities/resume.entity";
import { Skill } from "../skills/entities/skill.entity";
import { User } from "../users/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Resume, Skill, User])],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
