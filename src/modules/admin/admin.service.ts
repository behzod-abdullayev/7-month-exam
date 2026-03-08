import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Company } from "../companies/entities/company.entity";
import { Vacancy } from "../vacancies/entities/vacancy.entity";
import { Application } from "../applications/entities/application.entity";
import { Role } from "src/common/enums/role.enum";
import { VacancyStatus } from "../vacancies/entities/vacancy.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,
    @InjectRepository(Application)
    private readonly appRepo: Repository<Application>,
  ) {}

  // DASHBOARD STATS
  async getStats() {
    const [totalUsers, totalCompanies, totalVacancies, totalApplications] = await Promise.all([
      this.userRepo.count(),
      this.companyRepo.count(),
      this.vacancyRepo.count(),
      this.appRepo.count(),
    ]);

    const activeVacancies = await this.vacancyRepo.count({
      where: { status: VacancyStatus.ACTIVE },
    });

    const verifiedCompanies = await this.companyRepo.count({
      where: { isVerified: true },
    });

    return {
      totalUsers,
      totalCompanies,
      totalVacancies,
      totalApplications,
      activeVacancies,
      verifiedCompanies,
    };
  }

  // USERS
  async getAllUsers(page = 1, limit = 20) {
    const [data, total] = await this.userRepo.findAndCount({
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async changeUserRole(userId: string, role: Role) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");
    user.role = role;
    return this.userRepo.save(user);
  }

  async toggleUserActive(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");
    user.isActive = !user.isActive;
    return this.userRepo.save(user);
  }

  async deleteUser(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException("Foydalanuvchi topilmadi");
    await this.userRepo.remove(user);
    return { success: true, message: "Foydalanuvchi o'chirildi" };
  }

  // COMPANIES
  async getAllCompanies(page = 1, limit = 20) {
    const [data, total] = await this.companyRepo.findAndCount({
      relations: ["owner", "location"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async verifyCompany(companyId: string) {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException("Kompaniya topilmadi");
    company.isVerified = true;
    return this.companyRepo.save(company);
  }

  async deleteCompany(companyId: string) {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException("Kompaniya topilmadi");
    await this.companyRepo.remove(company);
    return { success: true, message: "Kompaniya o'chirildi" };
  }

  // VACANCIES
  async getAllVacancies(page = 1, limit = 20) {
    const [data, total] = await this.vacancyRepo.findAndCount({
      relations: ["company", "location", "category"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async deleteVacancy(vacancyId: string) {
    const vacancy = await this.vacancyRepo.findOne({ where: { id: vacancyId } });
    if (!vacancy) throw new NotFoundException("Vakansiya topilmadi");
    await this.vacancyRepo.remove(vacancy);
    return { success: true, message: "Vakansiya o'chirildi" };
  }
}
