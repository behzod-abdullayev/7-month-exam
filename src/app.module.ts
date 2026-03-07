import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

// Konfiglar
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

// Modullar
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/mail/mail.module'; // 👈 Qo'shildi
import { CompaniesModule } from './modules/companies/companies.module';
import { VacanciesModule } from './modules/vacancies/vacancies.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SkillsModule } from './modules/skills/skills.module';
import { LocationsModule } from './modules/locations/locations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.getOrThrow<TypeOrmModuleOptions>("database"),
    }),
    MailModule, 
    AuthModule,
    UsersModule, 
    CompaniesModule, 
    VacanciesModule, 
    ResumesModule, 
    ApplicationsModule, 
    CategoriesModule, 
    SkillsModule, 
    LocationsModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}