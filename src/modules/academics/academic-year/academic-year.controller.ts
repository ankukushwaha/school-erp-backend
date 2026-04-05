import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, BadRequestException, NotFoundException } from '@nestjs/common';
import { AcademicYearService } from './academic-year.service';
import { AcademicYearCreateDto, AcademicYearUpdateDto } from './dto/academic-year.dto';

@Controller('master/academic-year')
export class AcademicYearController {
  constructor(private readonly service: AcademicYearService) {}

  @Get()
  async getAll() {
    return this.service.getAllAsync();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.getByIdAsync(id);
    if (!result) {
      throw new NotFoundException({ message: 'Academic year not found' });
    }
    return result;
  }

  @Post()
  async create(@Body() dto: AcademicYearCreateDto) {
    try {
      const message = await this.service.createAsync(dto);
      return { message };
    } catch (e: any) {
      throw new BadRequestException({ message: e.message });
    }
  }

  @Put()
  async update(@Body() dto: AcademicYearUpdateDto) {
    try {
      const message = await this.service.updateAsync(dto);
      return { message };
    } catch (e: any) {
      throw new BadRequestException({ message: e.message });
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      const message = await this.service.deleteAsync(id);
      return { message };
    } catch (e: any) {
      throw new BadRequestException({ message: e.message });
    }
  }
}
