import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { ClassTeacherService } from './class-teacher.service';
import { CreateClassTeacherDto, UpdateClassTeacherDto } from './dto/class-teacher.dto';

@Controller('MClassTeacher')
export class ClassTeacherController {
  constructor(private readonly service: ClassTeacherService) {}

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Post()
  async create(@Body() dto: CreateClassTeacherDto) {
    const id = await this.service.create(dto);
    return { classTeacherId: id };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClassTeacherDto) {
    await this.service.update(id, dto);
    return 'Updated Successfully';
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Query('deletedBy') deletedBy: string) {
    await this.service.delete(id, deletedBy || 'ADMIN');
    return 'Deleted Successfully';
  }
}
