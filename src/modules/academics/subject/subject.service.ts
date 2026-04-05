import { Injectable, NotFoundException } from '@nestjs/common';
import { SubjectRepository } from './subject.repository';
import { SubjectDto, UpdateSubjectDto } from './dto/subject.dto';

@Injectable()
export class SubjectService {
  constructor(private readonly repo: SubjectRepository) {}

  async getSubjects() {
    return this.repo.getSubjects();
  }

  async getSubjectById(id: number) {
    const data = await this.repo.getSubjectById(id);
    if (!data) throw new NotFoundException('Subject not found');
    return data;
  }

  async createSubject(dto: SubjectDto) {
    return this.repo.createSubject(dto);
  }

  async updateSubject(dto: UpdateSubjectDto) {
    return this.repo.updateSubject(dto);
  }

  async deleteSubject(id: number) {
    return this.repo.deleteSubject(id);
  }
}
