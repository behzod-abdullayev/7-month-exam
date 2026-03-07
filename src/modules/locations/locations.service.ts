import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // 1. YANGI LOCATION QO'SHISH
  async create(dto: CreateLocationDto): Promise<Location> {
    const existing = await this.locationRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) throw new ConflictException('Bu joylashuv allaqachon mavjud');

    const location = this.locationRepository.create(dto);
    return await this.locationRepository.save(location);
  }

  // 2. BARCHA LOCATIONLAR
  async findAll(): Promise<Location[]> {
    return await this.locationRepository.find({
      order: { name: 'ASC' },
    });
  }

  // 3. VILOYAT BO'YICHA FILTER
  async findByRegion(region: string): Promise<Location[]> {
    return await this.locationRepository.find({
      where: { region },
      order: { name: 'ASC' },
    });
  }

  // 4. BITTA LOCATION
  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) throw new NotFoundException('Joylashuv topilmadi');
    return location;
  }

  // 5. KOORDINATALARDAN MANZIL OLISH (Yandex Geocoder)
  async reverseGeocode(lat: number, lng: number) {
    const apiKey = this.configService.get<string>('YANDEX_MAPS_API_KEY');
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${lng},${lat}&format=json&lang=uz_UZ`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const featureMembers = response.data?.response?.GeoObjectCollection?.featureMember;

      if (!featureMembers || featureMembers.length === 0) {
        throw new NotFoundException('Manzil topilmadi');
      }

      const geoObject = featureMembers[0].GeoObject;
      const components = geoObject.metaDataProperty.GeocoderMetaData.Address.Components;

      const city = components.find((c: any) => c.kind === 'locality')?.name || null;
      const district = components.find((c: any) => c.kind === 'district')?.name || null;
      const region = components.find((c: any) => c.kind === 'province')?.name || null;

      return {
        success: true,
        address: geoObject.metaDataProperty.GeocoderMetaData.text,
        details: {
          city,
          district,
          region,
          country: components.find((c: any) => c.kind === 'country')?.name || null,
        },
      };
    } catch (error) {
      this.logger.error(`Reverse geocode failed: ${error.message}`);
      throw new InternalServerErrorException('Manzilni aniqlashda xatolik yuz berdi');
    }
  }

  // 6. MANZILDAN KOORDINATALAR OLISH (Yandex Geocoder)
  async geocode(address: string) {
    const apiKey = this.configService.get<string>('YANDEX_MAPS_API_KEY');
    const encoded = encodeURIComponent(address);
    const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${encoded}&format=json&lang=uz_UZ&rspn=1&ll=64.5853,41.2995&spn=20,10`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      const featureMembers = response.data?.response?.GeoObjectCollection?.featureMember;

      if (!featureMembers || featureMembers.length === 0) {
        throw new NotFoundException('Manzil topilmadi');
      }

      const geoObject = featureMembers[0].GeoObject;
      const pos = geoObject.Point.pos.split(' ');

      return {
        success: true,
        lat: parseFloat(pos[1]),
        lng: parseFloat(pos[0]),
        address: geoObject.metaDataProperty.GeocoderMetaData.text,
      };
    } catch (error) {
      this.logger.error(`Geocode failed: ${error.message}`);
      throw new InternalServerErrorException('Koordinatalarni aniqlashda xatolik yuz berdi');
    }
  }

  // 7. O'ZBEKISTON VILOYATLARINI SEED QILISH
  async seedUzbekistanLocations(): Promise<{ message: string; added: number }> {
    const locations = [
      { name: "Toshkent shahri", region: "Toshkent", lat: 41.2995, lng: 69.2401 },
      { name: "Toshkent viloyati", region: "Toshkent", lat: 41.1123, lng: 69.8597 },
      { name: "Samarqand viloyati", region: "Samarqand", lat: 39.6542, lng: 66.9597 },
      { name: "Buxoro viloyati", region: "Buxoro", lat: 39.7747, lng: 64.4286 },
      { name: "Andijon viloyati", region: "Andijon", lat: 40.7821, lng: 72.3442 },
      { name: "Farg'ona viloyati", region: "Farg'ona", lat: 40.3864, lng: 71.7864 },
      { name: "Namangan viloyati", region: "Namangan", lat: 41.0011, lng: 71.6722 },
      { name: "Qashqadaryo viloyati", region: "Qashqadaryo", lat: 38.8600, lng: 65.7900 },
      { name: "Surxondaryo viloyati", region: "Surxondaryo", lat: 37.9400, lng: 67.5700 },
      { name: "Xorazm viloyati", region: "Xorazm", lat: 41.5500, lng: 60.6300 },
      { name: "Navoiy viloyati", region: "Navoiy", lat: 40.0900, lng: 65.3800 },
      { name: "Jizzax viloyati", region: "Jizzax", lat: 40.1200, lng: 67.8400 },
      { name: "Sirdaryo viloyati", region: "Sirdaryo", lat: 40.8300, lng: 68.6600 },
      { name: "Qoraqalpog'iston Respublikasi", region: "Qoraqalpog'iston", lat: 43.7300, lng: 59.0200 },
    ];

    let added = 0;
    for (const loc of locations) {
      const exists = await this.locationRepository.findOne({ where: { name: loc.name } });
      if (!exists) {
        await this.locationRepository.save(this.locationRepository.create(loc));
        added++;
      }
    }

    return { message: `${added} ta joylashuv muvaffaqiyatli qo'shildi`, added };
  }

  // 8. O'CHIRISH
  async remove(id: string): Promise<{ success: boolean; message: string }> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
    return { success: true, message: "Joylashuv muvaffaqiyatli o'chirildi" };
  }
} 