import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { SyllabusRepository } from './syllabus.repository';
import { CreateSyllabusDto, UpdateSyllabusDto } from './dto/syllabus.dto';

@Injectable()
export class SyllabusService {
  constructor(private readonly repo: SyllabusRepository) { }

  async getAll(classId?: number) {
    return this.repo.getAllAsync(classId);
  }

  async getById(id: number) {
    const data = await this.repo.getByIdAsync(id);
    if (!data) throw new NotFoundException('Syllabus not found');
    return data;
  }

  async create(dto: CreateSyllabusDto) {
    const exists = await this.repo.checkExistsAsync(dto.classId, dto.subjectId, dto.termName || '', dto.academicYear || '');
    if (exists) throw new ConflictException('Syllabus already exists for this Class, Subject, Term, and Academic Year');
    return this.repo.createAsync(dto);
  }

  async update(id: number, dto: UpdateSyllabusDto) {
    const exists = await this.repo.checkExistsAsync(dto.classId, dto.subjectId, dto.termName || '', dto.academicYear || '', id);
    if (exists) throw new ConflictException('Syllabus already exists for this Class, Subject, Term, and Academic Year');
    const success = await this.repo.updateAsync(id, dto);
    if (!success) throw new NotFoundException('Syllabus not found');
    return success;
  }

  async delete(id: number) {
    const success = await this.repo.deleteAsync(id);
    if (!success) throw new NotFoundException('Syllabus not found');
    return success;
  }
}
