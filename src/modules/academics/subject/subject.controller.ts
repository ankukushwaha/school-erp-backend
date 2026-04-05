import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectDto, UpdateSubjectDto } from './dto/subject.dto';

@Controller('Subject')
export class SubjectController {
  constructor(private readonly service: SubjectService) {}

  @Get()
  async getSubjects() {
    return this.service.getSubjects();
  }

  @Get(':id')
  async getSubject(@Param('id', ParseIntPipe) id: number) {
    return this.service.getSubjectById(id);
  }

  @Post()
  async createSubject(@Body() dto: SubjectDto) {
    try {
      const id = await this.service.createSubject(dto);
      return { message: 'Created successfully', id };
    } catch (ex: any) {
      throw new BadRequestException(ex.message);
    }
  }

  @Put()
  async updateSubject(@Body() dto: UpdateSubjectDto) {
    try {
      const result = await this.service.updateSubject(dto);
      return { message: 'Updated successfully', result };
    } catch (ex: any) {
      throw new BadRequestException(ex.message);
    }
  }

  @Delete(':id')
  async deleteSubject(@Param('id', ParseIntPipe) id: number) {
    const result = await this.service.deleteSubject(id);
    return { message: 'Deleted successfully', result };
  }
}
