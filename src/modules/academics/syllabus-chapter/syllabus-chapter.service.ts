import { Injectable, NotFoundException } from '@nestjs/common';
import { SyllabusChapterRepository } from './syllabus-chapter.repository';
import { CreateSyllabusChapterDto, UpdateSyllabusChapterDto } from './dto/syllabus-chapter.dto';

@Injectable()
export class SyllabusChapterService {
  constructor(private readonly repo: SyllabusChapterRepository) { }

  async getAll(syllabusId?: number) {
    return this.repo.getAllAsync(syllabusId);
  }

  async getById(id: number) {
    const data = await this.repo.getByIdAsync(id);
    if (!data) throw new NotFoundException('Chapter not found');
    return data;
  }

  async create(dto: CreateSyllabusChapterDto) {
    return this.repo.createAsync(dto);
  }

  async update(id: number, dto: UpdateSyllabusChapterDto) {
    const success = await this.repo.updateAsync(id, dto);
    if (!success) throw new NotFoundException('Chapter not found');
    return success;
  }

  async delete(id: number) {
    const success = await this.repo.deleteAsync(id);
    if (!success) throw new NotFoundException('Chapter not found');
    return success;
  }
}
