import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { AcademicCalendarService } from './academic-calendar.service';
import { CreateAcademicCalendarDto, UpdateAcademicCalendarDto } from './dto/academic-calendar.dto';

@Controller('AcademicCalendar')
export class AcademicCalendarController {
  constructor(private readonly service: AcademicCalendarService) {}

  @Post()
  async create(@Body() dto: CreateAcademicCalendarDto) {
    return this.service.create(dto);
  }

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Put()
  async update(@Body() dto: UpdateAcademicCalendarDto) {
    return this.service.update(dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
