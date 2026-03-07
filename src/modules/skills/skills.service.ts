import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async create(dto: CreateSkillDto): Promise<Skill> {
    const existing = await this.skillRepository.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Bu skill allaqachon mavjud');

    const skill = this.skillRepository.create(dto);
    return await this.skillRepository.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return await this.skillRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async search(query: string): Promise<Skill[]> {
    return await this.skillRepository.find({
      where: { name: Like(`%${query}%`), isActive: true },
      take: 20,
    });
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) throw new NotFoundException('Skill topilmadi');
    return skill;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const skill = await this.findOne(id);
    await this.skillRepository.remove(skill);
    return { success: true, message: "Skill o'chirildi" };
  }

  async seedSkills(): Promise<{ message: string; added: number }> {
    const skills = [
      // IT
      "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "PHP", "Go", "Rust", "Swift",
      "React", "Angular", "Vue.js", "NestJS", "Node.js", "Django", "Laravel", "Spring Boot",
      "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Git",
      // Dizayn
      "Figma", "Adobe Photoshop", "Adobe Illustrator", "UI/UX Design", "Canva",
      // Marketing
      "SEO", "SMM", "Google Ads", "Content Marketing", "Email Marketing",
      // Moliya
      "Buxgalteriya", "1C", "Excel", "Moliyaviy tahlil", "Soliq hisobi",
      // Umumiy
      "Microsoft Office", "Loyiha boshqaruvi", "Ingliz tili", "Rus tili", "Muzokaralar",
      "Jamoada ishlash", "Muammolarni hal qilish", "Vaqtni boshqarish",
    ];

    let added = 0;
    for (const name of skills) {
      const exists = await this.skillRepository.findOne({ where: { name } });
      if (!exists) {
        await this.skillRepository.save(this.skillRepository.create({ name }));
        added++;
      }
    }
    return { message: `${added} ta skill qo'shildi`, added };
  }
}