import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { SyllabusTopicService } from './syllabus-topic.service';
import { CreateSyllabusTopicDto, UpdateSyllabusTopicDto } from './dto/syllabus-topic.dto';

@Controller('syllabus-topic')
export class SyllabusTopicController {
  constructor(private readonly service: SyllabusTopicService) { }

  @Post('get/all')
  async getAll(@Body('syllabusChapterId') syllabusChapterId?: number) {
    return this.service.getAll(syllabusChapterId);
  }

  @Get('get/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post('create')
  async create(@Body() dto: CreateSyllabusTopicDto) {
    const topicId = await this.service.create(dto);
    return { topicId };
  }

  @Put('update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSyllabusTopicDto) {
    return this.service.update(id, dto);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
