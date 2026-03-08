import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Application, ApplicationStatus } from "./entities/application.entity";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { User } from "../users/entities/user.entity";
import { Role } from "src/common/enums/role.enum";
import { Vacancy, VacancyStatus } from "../vacancies/entities/vacancy.entity";

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,
  ) {}

  // CREATE - ariza yuborish
  async create(dto: CreateApplicationDto, currentUser: User): Promise<Application> {
    // Vacancy mavjud va active ekanligini tekshirish
    const vacancy = await this.vacancyRepo.findOne({ where: { id: dto.vacancyId } });
    if (!vacancy) throw new NotFoundException("Vakansiya topilmadi");
    if (vacancy.status !== VacancyStatus.ACTIVE) {
      throw new BadRequestException("Bu vakansiya endi aktiv emas");
    }

    // O'z vakansiyasiga apply qila olmaydi
    if (vacancy.postedById === currentUser.id) {
      throw new ForbiddenException("O'z vakansiyangizga ariza bera olmaysiz");
    }

    // Takroriy ariza
    const existing = await this.appRepo.findOne({
      where: { userId: currentUser.id, vacancyId: dto.vacancyId },
    });
    if (existing) throw new ConflictException("Siz bu vakansiyaga allaqachon ariza bergansiz");

    const application = this.appRepo.create({
      ...dto,
      resumeId: dto.resumeId || null,
      userId: currentUser.id,
    });

    return this.appRepo.save(application);
  }

  // GET ALL - employer o'z vakansiyalariga kelgan arizalar
  async findAll(currentUser: User, vacancyId?: string) {
    const qb = this.appRepo
      .createQueryBuilder("app")
      .leftJoinAndSelect("app.user", "user")
      .leftJoinAndSelect("app.vacancy", "vacancy")
      .leftJoinAndSelect("app.resume", "resume");

    if (currentUser.role === Role.EMPLOYER) {
      qb.innerJoin("vacancy.postedBy", "poster").where("poster.id = :userId", { userId: currentUser.id });
    } else if (currentUser.role === Role.JOB_SEEKER) {
      qb.where("app.userId = :userId", { userId: currentUser.id });
    }

    if (vacancyId) {
      qb.andWhere("app.vacancyId = :vacancyId", { vacancyId });
    }

    qb.orderBy("app.createdAt", "DESC");
    return qb.getMany();
  }

  // FIND ONE
  async findOne(id: string, currentUser: User): Promise<Application> {
    const app = await this.appRepo.findOne({
      where: { id },
      relations: ["user", "vacancy", "resume"],
    });
    if (!app) throw new NotFoundException("Ariza topilmadi");

    // Faqat o'zining arizasini yoki employer o'z vakansiyasidagini ko'ra oladi
    if (currentUser.role !== Role.ADMIN && app.userId !== currentUser.id && app.vacancy.postedById !== currentUser.id) {
      throw new ForbiddenException("Bu arizani ko'rish huquqingiz yo'q");
    }

    return app;
  }

  // UPDATE STATUS - faqat employer yoki admin
  async updateStatus(id: string, dto: UpdateApplicationDto, currentUser: User): Promise<Application> {
    const app = await this.appRepo.findOne({
      where: { id },
      relations: ["vacancy"],
    });
    if (!app) throw new NotFoundException("Ariza topilmadi");

    // Job seeker faqat o'z arizasini WITHDRAWN qila oladi
    if (currentUser.role === Role.JOB_SEEKER) {
      if (app.userId !== currentUser.id) {
        throw new ForbiddenException("Bu arizani o'zgartirish huquqingiz yo'q");
      }
      if (dto.status !== ApplicationStatus.WITHDRAWN) {
        throw new ForbiddenException("Siz faqat arizangizni bekor qila olasiz");
      }
    } else if (currentUser.role === Role.EMPLOYER) {
      if (app.vacancy.postedById !== currentUser.id) {
        throw new ForbiddenException("Bu arizani o'zgartirish huquqingiz yo'q");
      }
    }

    Object.assign(app, dto);
    return this.appRepo.save(app);
  }

  // DELETE - faqat o'zi yoki admin
  async remove(id: string, currentUser: User) {
    const app = await this.appRepo.findOne({ where: { id } });
    if (!app) throw new NotFoundException("Ariza topilmadi");

    if (app.userId !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException("Bu arizani o'chirish huquqingiz yo'q");
    }

    await this.appRepo.remove(app);
    return { success: true, message: "Ariza muvaffaqiyatli o'chirildi" };
  }
}
