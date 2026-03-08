import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Favourite } from "./entities/favourite.entity";
import { CreateFavouriteDto } from "./dto/create-favourite.dto";
import { User } from "../users/entities/user.entity";
import { Vacancy } from "../vacancies/entities/vacancy.entity";

@Injectable()
export class FavouritesService {
  constructor(
    @InjectRepository(Favourite)
    private readonly favRepo: Repository<Favourite>,
    @InjectRepository(Vacancy)
    private readonly vacancyRepo: Repository<Vacancy>,
  ) {}

  async add(dto: CreateFavouriteDto, currentUser: User): Promise<Favourite> {
    const vacancy = await this.vacancyRepo.findOne({ where: { id: dto.vacancyId } });
    if (!vacancy) throw new NotFoundException("Vakansiya topilmadi");

    const existing = await this.favRepo.findOne({
      where: { userId: currentUser.id, vacancyId: dto.vacancyId },
    });
    if (existing) throw new ConflictException("Bu vakansiya allaqachon sevimlilar ro'yxatida");

    const fav = this.favRepo.create({ userId: currentUser.id, vacancyId: dto.vacancyId });
    return this.favRepo.save(fav);
  }

  async findMy(currentUser: User): Promise<Favourite[]> {
    return this.favRepo.find({
      where: { userId: currentUser.id },
      relations: ["vacancy", "vacancy.company", "vacancy.location", "vacancy.skills"],
      order: { createdAt: "DESC" },
    });
  }

  async remove(vacancyId: string, currentUser: User) {
    const fav = await this.favRepo.findOne({
      where: { userId: currentUser.id, vacancyId },
    });
    if (!fav) throw new NotFoundException("Sevimlilar ro'yxatida topilmadi");
    await this.favRepo.remove(fav);
    return { success: true, message: "Sevimlilardan o'chirildi" };
  }
}
