import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { VacanciesModule } from './modules/vacancies/vacancies.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SkillsModule } from './modules/skills/skills.module';
import { LocationsModule } from './modules/locations/locations.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule, CompaniesModule, VacanciesModule, ResumesModule, ApplicationsModule, CategoriesModule, SkillsModule, LocationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig]
    }),
TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.getOrThrow<TypeOrmModuleOptions>("database"),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
