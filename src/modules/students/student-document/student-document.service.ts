import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { StudentDocumentRepository } from './student-document.repository';
import { CreateStudentDocumentDto, StudentDocumentDto } from './dto/student-document.dto';

@Injectable()
export class StudentDocumentService {
  constructor(private readonly repo: StudentDocumentRepository) {}

  async create(dto: CreateStudentDocumentDto) {
    const result = await this.repo.createStudentDocument(dto);
    if (!result.status) {
      throw new BadRequestException(result.message);
    }
    return result.data;
  }

  async getAll() {
    return this.repo.getAllStudentDocuments();
  }

  async getById(id: number) {
    const data = await this.repo.getStudentDocumentById(id);
    if (!data) throw new NotFoundException('Student Document not found');
    return data;
  }

  async update(dto: StudentDocumentDto) {
    const success = await this.repo.updateStudentDocument(dto);
    if (!success) throw new NotFoundException('Student Document not found');
    return success;
  }

  async delete(id: number) {
    const success = await this.repo.deleteStudentDocument(id);
    if (!success) throw new NotFoundException('Student Document not found');
    return success;
  }
}
