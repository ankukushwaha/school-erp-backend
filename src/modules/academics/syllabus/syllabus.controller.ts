import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { CreateSyllabusDto, UpdateSyllabusDto } from './dto/syllabus.dto';

@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly service: SyllabusService) {}

  @Get('get/all')
  async getAll() {
    return this.service.getAll();
  }

  @Get('get/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post('create')
  async create(@Body() dto: CreateSyllabusDto) {
    const id = await this.service.create(dto);
    return { id };
  }

  @Put('update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSyllabusDto) {
    return this.service.update(id, dto);
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
