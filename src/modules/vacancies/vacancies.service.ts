import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

import { Vacancy, VacancyStatus } from "./entities/vacancy.entity";
import { CreateVacancyDto } from "./dto/create-vacancy.dto";
import { UpdateVacancyDto } from "./dto/update-vacancy.dto";
import { FilterVacancyDto } from "./dto/filter-vacancy.dto";
import { User } from "../users/entities/user.entity";
import { Role } from "src/common/enums/role.enum";
import { Company } from "../companies/entities/company.entity";
import { Skill } from "../skills/entities/skill.entity";

@Injectable()
export class VacanciesService {
  private readonly logger = new Logger(VacanciesService.name);

  constructor(
    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
  ) {}

  // CREATE
  async create(dto: CreateVacancyDto, currentUser: User): Promise<Vacancy> {
    const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!company) throw new NotFoundException("Kompaniya topilmadi");

    if (company.ownerId !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException("Siz faqat o'z kompaniyangizga vakansiya qo'sha olasiz");
    }
    if (!company.isActive) {
      throw new BadRequestException("Faol bo'lmagan kompaniya uchun vakansiya qo'shib bo'lmaydi");
    }

    let skills: Skill[] = [];
    if (dto.skillIds?.length) {
      skills = await this.skillRepo.findBy({ id: In(dto.skillIds) });
    }

    if (dto.salaryMin && dto.salaryMax && dto.salaryMin > dto.salaryMax) {
      throw new BadRequestException("Minimum maosh maksimumdan katta bo'lishi mumkin emas");
    }

    const vacancy = this.vacancyRepo.create({ ...dto, postedById: currentUser.id, skills });
    return this.vacancyRepo.save(vacancy);
  }

  // FIND ALL
  async findAll(filter: FilterVacancyDto) {
    const {
      search,
      jobType,
      experienceLevel,
      status,
      categoryId,
      locationId,
      companyId,
      salaryMin,
      salaryMax,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
    } = filter;

    const qb = this.vacancyRepo
      .createQueryBuilder("vacancy")
      .leftJoinAndSelect("vacancy.company", "company")
      .leftJoinAndSelect("vacancy.location", "location")
      .leftJoinAndSelect("vacancy.category", "category")
      .leftJoinAndSelect("vacancy.skills", "skills");

    qb.andWhere("vacancy.status = :status", {
      status: status ?? VacancyStatus.ACTIVE,
    });

    if (search) {
      qb.andWhere("(LOWER(vacancy.title) LIKE :search OR LOWER(vacancy.description) LIKE :search)", {
        search: `%${search.toLowerCase()}%`,
      });
    }
    if (jobType) qb.andWhere("vacancy.jobType = :jobType", { jobType });
    if (experienceLevel) qb.andWhere("vacancy.experienceLevel = :experienceLevel", { experienceLevel });
    if (categoryId) qb.andWhere("vacancy.categoryId = :categoryId", { categoryId });
    if (locationId) qb.andWhere("vacancy.locationId = :locationId", { locationId });
    if (companyId) qb.andWhere("vacancy.companyId = :companyId", { companyId });
    if (salaryMin) qb.andWhere("vacancy.salaryMin >= :salaryMin", { salaryMin });
    if (salaryMax) qb.andWhere("vacancy.salaryMax <= :salaryMax", { salaryMax });

    const allowedSort = ["createdAt", "salaryMin", "salaryMax", "viewsCount", "title"];
    const safeSortBy = allowedSort.includes(sortBy) ? sortBy : "createdAt";
    qb.orderBy(`vacancy.${safeSortBy}`, sortOrder);
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // FIND ONE
  async findOne(id: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepo.findOne({
      where: { id },
      relations: ["company", "location", "category", "skills", "postedBy"],
    });
    if (!vacancy) throw new NotFoundException("Vakansiya topilmadi");

    await this.vacancyRepo.increment({ id }, "viewsCount", 1);
    vacancy.viewsCount += 1;
    return vacancy;
  }

  // MY VACANCIES
  async findMyVacancies(userId: string, filter: FilterVacancyDto) {
    const { page = 1, limit = 10, status, search } = filter;

    const qb = this.vacancyRepo
      .createQueryBuilder("vacancy")
      .leftJoinAndSelect("vacancy.company", "company")
      .leftJoinAndSelect("vacancy.location", "location")
      .leftJoinAndSelect("vacancy.category", "category")
      .leftJoinAndSelect("vacancy.skills", "skills")
      .where("vacancy.postedById = :userId", { userId });

    if (status) qb.andWhere("vacancy.status = :status", { status });
    if (search) {
      qb.andWhere("LOWER(vacancy.title) LIKE :search", {
        search: `%${search.toLowerCase()}%`,
      });
    }

    qb.orderBy("vacancy.createdAt", "DESC");
    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // UPDATE
  async update(id: string, dto: UpdateVacancyDto, currentUser: User): Promise<Vacancy> {
    const vacancy = await this.findOneRaw(id);
    this.checkOwnership(vacancy, currentUser);

    if (dto.skillIds !== undefined) {
      vacancy.skills = dto.skillIds.length ? await this.skillRepo.findBy({ id: In(dto.skillIds) }) : [];
    }

    const newMin = dto.salaryMin ?? vacancy.salaryMin;
    const newMax = dto.salaryMax ?? vacancy.salaryMax;
    if (newMin && newMax && newMin > newMax) {
      throw new BadRequestException("Minimum maosh maksimumdan katta bo'lishi mumkin emas");
    }

    const { skillIds, ...rest } = dto;
    Object.assign(vacancy, rest);
    return this.vacancyRepo.save(vacancy);
  }

  // CHANGE STATUS
  async changeStatus(id: string, status: VacancyStatus, currentUser: User): Promise<Vacancy> {
    const vacancy = await this.findOneRaw(id);
    this.checkOwnership(vacancy, currentUser);
    vacancy.status = status;
    return this.vacancyRepo.save(vacancy);
  }

  // DELETE
  async remove(id: string, currentUser: User) {
    const vacancy = await this.findOneRaw(id);
    this.checkOwnership(vacancy, currentUser);
    await this.vacancyRepo.remove(vacancy);
    return { success: true, message: "Vakansiya muvaffaqiyatli o'chirildi" };
  }

  // HELPERS
  private async findOneRaw(id: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepo.findOne({ where: { id }, relations: ["skills"] });
    if (!vacancy) throw new NotFoundException("Vakansiya topilmadi");
    return vacancy;
  }

  private checkOwnership(vacancy: Vacancy, user: User): void {
    if (vacancy.postedById !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException("Bu vakansiyani o'zgartirish huquqingiz yo'q");
    }
  }
}
