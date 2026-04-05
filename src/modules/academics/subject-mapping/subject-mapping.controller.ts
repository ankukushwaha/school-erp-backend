import { Controller, Get, Post, Put, Delete, Param, Body, Query, BadRequestException } from '@nestjs/common';
import { SubjectMappingService } from './subject-mapping.service';
import { SubjectMappingCreateDto } from './dto/subject-mapping.dto';

@Controller('SubjectMapping')
export class SubjectMappingController {
  constructor(private readonly service: SubjectMappingService) {}

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.service.getById(Number(id));
  }

  @Post()
  async create(@Body() dto: SubjectMappingCreateDto) {
    try {
      const id = await this.service.create(dto);
      return { id, message: 'Created Successfully' };
    } catch (ex: any) {
      throw new BadRequestException(ex.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: SubjectMappingCreateDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Query('deletedBy') deletedBy: string) {
    return this.service.delete(Number(id), deletedBy);
  }
}
