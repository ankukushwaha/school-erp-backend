import { Injectable, NotFoundException } from '@nestjs/common';
import { SyllabusRepository } from './syllabus.repository';
import { CreateSyllabusDto, UpdateSyllabusDto } from './dto/syllabus.dto';

@Injectable()
export class SyllabusService {
  constructor(private readonly repo: SyllabusRepository) {}

  async getAll() {
    return this.repo.getAllAsync();
  }

  async getById(id: number) {
    const data = await this.repo.getByIdAsync(id);
    if (!data) throw new NotFoundException('Syllabus not found');
    return data;
  }

  async create(dto: CreateSyllabusDto) {
    return this.repo.createAsync(dto);
  }

  async update(id: number, dto: UpdateSyllabusDto) {
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
