import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepository.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Bu kategoriya allaqachon mavjud');

    const category = this.categoryRepository.create(dto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Kategoriya topilmadi');
    return category;
  }

  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return { success: true, message: "Kategoriya o'chirildi" };
  }

  async seedCategories(): Promise<{ message: string; added: number }> {
    const categories = [
      { name: "IT va Dasturlash", icon: "💻", color: "#4F46E5" },
      { name: "Moliya va Buxgalteriya", icon: "💰", color: "#059669" },
      { name: "Marketing va Reklama", icon: "📢", color: "#DC2626" },
      { name: "Dizayn va Kreativ", icon: "🎨", color: "#7C3AED" },
      { name: "Ta'lim va Fan", icon: "📚", color: "#2563EB" },
      { name: "Tibbiyot va Sog'liqni saqlash", icon: "🏥", color: "#0891B2" },
      { name: "Qurilish va Arxitektura", icon: "🏗️", color: "#92400E" },
      { name: "Logistika va Transport", icon: "🚚", color: "#B45309" },
      { name: "Ishlab chiqarish", icon: "🏭", color: "#374151" },
      { name: "Xizmat ko'rsatish", icon: "🤝", color: "#0D9488" },
      { name: "Huquq va Yuridik xizmatlar", icon: "⚖️", color: "#1D4ED8" },
      { name: "Savdo va Sotuvchi", icon: "🛒", color: "#EA580C" },
      { name: "Oshxona va Restoran", icon: "🍽️", color: "#CA8A04" },
      { name: "Qishloq xo'jaligi", icon: "🌾", color: "#16A34A" },
      { name: "Media va Jurnalistika", icon: "📰", color: "#9333EA" },
    ];

    let added = 0;
    for (const cat of categories) {
      const exists = await this.categoryRepository.findOne({ 
        where: { name: cat.name } 
      });
      if (!exists) {
        await this.categoryRepository.save(
          this.categoryRepository.create(cat) 
        );
        added++;
      }
    }
    return { message: `${added} ta kategoriya qo'shildi`, added };
  }
}
