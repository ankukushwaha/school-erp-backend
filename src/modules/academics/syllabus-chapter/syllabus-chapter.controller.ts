import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SyllabusChapterService } from './syllabus-chapter.service';
import { CreateSyllabusChapterDto, UpdateSyllabusChapterDto } from './dto/syllabus-chapter.dto';

@Controller('syllabus-chapter')
export class SyllabusChapterController {
  constructor(private readonly service: SyllabusChapterService) {}

  @Post('get/all')
  async getAll(@Body() body: { syllabusId?: number }) {
    return this.service.getAll(body.syllabusId);
  }

  @Get('get/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post('create')
  async create(@Body() dto: CreateSyllabusChapterDto) {
    const syllabusChapterId = await this.service.create(dto);
    return { syllabusChapterId };
  }

  @Put('update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSyllabusChapterDto) {
    return this.service.update(id, dto);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
