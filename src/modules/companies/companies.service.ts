import {
  Injectable, NotFoundException,
  ForbiddenException, ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  // 1. KOMPANIYA YARATISH
  async create(dto: CreateCompanyDto, ownerId: string): Promise<Company> {
    const existing = await this.companyRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) throw new ConflictException('Bu nomli kompaniya allaqachon mavjud');

    const company = this.companyRepository.create({
      ...dto,
      ownerId,
    });
    return await this.companyRepository.save(company);
  }

  // 2. BARCHA KOMPANIYALAR
  async findAll(): Promise<Company[]> {
    return await this.companyRepository.find({
      where: { isActive: true },
      relations: ['owner', 'location'],
      select: {
        owner: { id: true, firstName: true, lastName: true, email: true }
      },
      order: { createdAt: 'DESC' },
    });
  }

  // 3. BITTA KOMPANIYA
  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: ['owner', 'location'],
      select: {
        owner: { id: true, firstName: true, lastName: true, email: true }
      },
    });
    if (!company) throw new NotFoundException('Kompaniya topilmadi');
    return company;
  }

  // 4. MENING KOMPANIYALARIM
  async findMyCompanies(ownerId: string): Promise<Company[]> {
    return await this.companyRepository.find({
      where: { ownerId, isActive: true },
      relations: ['location'],
      order: { createdAt: 'DESC' },
    });
  }

  // 5. YANGILASH
  async update(id: string, dto: UpdateCompanyDto, userId: string, logo?: string): Promise<Company> {
    const company = await this.findOne(id);

    if (company.ownerId !== userId) {
      throw new ForbiddenException('Siz faqat o\'z kompaniyangizni yangilay olasiz');
    }

    if (logo) {
      company.logo = logo;
    }

    Object.assign(company, dto);
    return await this.companyRepository.save(company);
  }

  // 6. O'CHIRISH
  async remove(id: string, userId: string): Promise<{ success: boolean; message: string }> {
    const company = await this.findOne(id);

    if (company.ownerId !== userId) {
      throw new ForbiddenException('Siz faqat o\'z kompaniyangizni o\'chira olasiz');
    }

    company.isActive = false;
    await this.companyRepository.save(company);
    return { success: true, message: 'Kompaniya muvaffaqiyatli o\'chirildi' };
  }

  // 7. ADMIN - VERIFY QILISH
  async verify(id: string): Promise<Company> {
    const company = await this.findOne(id);
    company.isVerified = true;
    return await this.companyRepository.save(company);
  }
}