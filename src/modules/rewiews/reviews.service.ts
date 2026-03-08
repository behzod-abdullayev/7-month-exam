import { Injectable, NotFoundException, ForbiddenException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Review } from "./entities/review.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { User } from "../users/entities/user.entity";
import { Role } from "src/common/enums/role.enum";
import { Company } from "../companies/entities/company.entity";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async create(dto: CreateReviewDto, currentUser: User): Promise<Review> {
    const company = await this.companyRepo.findOne({ where: { id: dto.companyId } });
    if (!company) throw new NotFoundException("Kompaniya topilmadi");

    // O'z kompaniyasiga review yoza olmaydi
    if (company.ownerId === currentUser.id) {
      throw new ForbiddenException("O'z kompaniyangizga baho bera olmaysiz");
    }

    const existing = await this.reviewRepo.findOne({
      where: { userId: currentUser.id, companyId: dto.companyId },
    });
    if (existing) throw new ConflictException("Siz bu kompaniyaga allaqachon baho bergansiz");

    const review = this.reviewRepo.create({ ...dto, userId: currentUser.id });
    return this.reviewRepo.save(review);
  }

  async findByCompany(companyId: string, page = 1, limit = 10) {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) throw new NotFoundException("Kompaniya topilmadi");

    const [data, total] = await this.reviewRepo.findAndCount({
      where: { companyId },
      relations: ["user"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Anonimlik - user ma'lumotlarini yashirish
    const sanitized = data.map((r) => ({
      ...r,
      user: r.isAnonymous ? null : r.user,
    }));

    // O'rtacha reyting
    const avgRating = data.length ? data.reduce((sum, r) => sum + r.rating, 0) / data.length : 0;

    return {
      data: sanitized,
      avgRating: Math.round(avgRating * 10) / 10,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async remove(id: string, currentUser: User) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException("Baho topilmadi");

    if (review.userId !== currentUser.id && currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException("Bu bahoni o'chirish huquqingiz yo'q");
    }

    await this.reviewRepo.remove(review);
    return { success: true, message: "Baho o'chirildi" };
  }
}
