import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { StudentDocumentService } from './student-document.service';
import { CreateStudentDocumentDto, StudentDocumentDto } from './dto/student-document.dto';

@Controller('student-document')
export class StudentDocumentController {
  constructor(private readonly service: StudentDocumentService) {}

  @Post('create')
  async create(@Body() dto: CreateStudentDocumentDto) {
    return this.service.create(dto);
  }

  @Get('get-all')
  async getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
