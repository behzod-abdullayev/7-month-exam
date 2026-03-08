import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";

import { Resume, ResumeStatus } from "./entities/resume.entity";
import { CreateResumeDto } from "./dto/create-resume.dto";
import { UpdateResumeDto } from "./dto/update-resume.dto";
import { User } from "../users/entities/user.entity";
import { Role } from "src/common/enums/role.enum";
import { Skill } from "../skills/entities/skill.entity";

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepo: Repository<Resume>,
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
  ) {}

  // CREATE
  async create(dto: CreateResumeDto, currentUser: User): Promise<Resume> {
    let skills: Skill[] = [];
    if (dto.skillIds?.length) {
      skills = await this.skillRepo.findBy({ id: In(dto.skillIds) });
    }

    if (dto.expectedSalaryMin && dto.expectedSalaryMax && dto.expectedSalaryMin > dto.expectedSalaryMax) {
      throw new BadRequestException("Minimum maosh maksimumdan katta bo'lishi mumkin emas");
    }

    const resume = this.resumeRepo.create({
      ...dto,
      locationId: dto.locationId || null,
      userId: currentUser.id,
      skills,
    });

    return this.resumeRepo.save(resume);
  }

  // FIND ALL (public - faqat active)
  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.resumeRepo.findAndCount({
      where: { status: ResumeStatus.ACTIVE },
      relations: ["user", "location", "skills"],
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // FIND ONE
  async findOne(id: string): Promise<Resume> {
    const resume = await this.resumeRepo.findOne({
      where: { id },
      relations: ["user", "location", "skills"],
    });
    if (!resume) throw new NotFoundException("Rezyume topilmadi");
    return resume;
  }

  // MY RESUMES
  async findMyResumes(userId: string): Promise<Resume[]> {
    return this.resumeRepo.find({
      where: { userId },
      relations: ["location", "skills"],
      order: { createdAt: "DESC" },
    });
  }

  // UPDATE
  async update(id: string, dto: UpdateResumeDto, currentUser: User): Promise<Resume> {
    const resume = await this.findOneRaw(id);
    this.checkOwnership(resume, currentUser);

    if (dto.skillIds !== undefined) {
      resume.skills = dto.skillIds.length ? await this.skillRepo.findBy({ id: In(dto.skillIds) }) : [];
    }

    if (dto.expectedSalaryMin && dto.expectedSalaryMax && dto.expectedSalaryMin > dto.expectedSalaryMax) {
      throw new BadRequestException("Minimum maosh maksimumdan katta bo'lishi mumkin emas");
    }

    const { skillIds, ...rest } = dto;
    Object.assign(resume, rest);
    return this.resumeRepo.save(resume);
  }

  // DELETE
  async remove(id: string, currentUser: User) {
    const resume = await this.findOneRaw(id);
    this.checkOwnership(resume, currentUser);
    await this.resumeRepo.remove(resume);
    return { success: true, message: "Rezyume muvaffaqiyatli o'chirildi" };
  }

  // HELPERS
  private async findOneRaw(id: string): Promise<Resume> {
    const resume = await this.resumeRepo.findOne({ where: { id }, relations: ["skills"] });
    if (!resume) throw new NotFoundException("Rezyume topilmadi");
    return resume;
  }

  private checkOwnership(resume: Resume, user: User): void {
    if (resume.userId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException("Bu rezyumeni o'zgartirish huquqingiz yo'q");
    }
  }
}
