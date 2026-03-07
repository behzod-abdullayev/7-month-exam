import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha skilllarni olish' })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Skill qidirish' })
  @ApiQuery({ name: 'q', example: 'Java', required: true })
  search(@Query('q') query: string) {
    return this.skillsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta skillni olish' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Yangi skill qo\'shish' })
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Post('seed')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Skilllarni DB ga qo\'shish (bir marta)' })
  seed() {
    return this.skillsService.seedSkills();
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Skillni o\'chirish' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}