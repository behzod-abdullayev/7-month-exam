import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // Barcha kompaniyalar - hamma ko'ra oladi
  @Get()
  @ApiOperation({ summary: 'Barcha kompaniyalarni olish' })
  findAll() {
    return this.companiesService.findAll();
  }

  // Mening kompaniyalarim
  @Get('my')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  @ApiOperation({ summary: 'Mening kompaniyalarim' })
  findMyCompanies(@CurrentUser() user: any) {
    return this.companiesService.findMyCompanies(user.id);
  }

  // Bitta kompaniya
  @Get(':id')
  @ApiOperation({ summary: 'Bitta kompaniyani olish' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  // Kompaniya yaratish - faqat employer
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  @ApiOperation({ summary: 'Yangi kompaniya yaratish (faqat employer)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/logos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Faqat rasm fayllari!'), false);
      }
      cb(null, true);
    },
  }))
  create(
    @Body() dto: CreateCompanyDto,
    @CurrentUser() user: any,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    if (logo) dto['logo'] = logo.filename;
    return this.companiesService.create(dto, user.id);
  }

  // Kompaniya yangilash
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  @ApiOperation({ summary: 'Kompaniyani yangilash' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/logos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @CurrentUser() user: any,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.companiesService.update(id, dto, user.id, logo?.filename);
  }

  // Kompaniya o'chirish
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer')
  @ApiOperation({ summary: 'Kompaniyani o\'chirish' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.companiesService.remove(id, user.id);
  }

  // Admin - verify qilish
  @Put(':id/verify')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Kompaniyani tasdiqlash (faqat admin)' })
  verify(@Param('id') id: string) {
    return this.companiesService.verify(id);
  }
}