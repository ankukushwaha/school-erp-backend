import { Injectable, NotFoundException } from '@nestjs/common';
import { SubjectMappingRepository } from './subject-mapping.repository';
import { SubjectMappingCreateDto } from './dto/subject-mapping.dto';

@Injectable()
export class SubjectMappingService {
  constructor(private readonly repo: SubjectMappingRepository) {}

  async getAll() {
    return this.repo.getAllAsync();
  }

  async getById(id: number) {
    const data = await this.repo.getByIdAsync(id);
    if (!data) throw new NotFoundException('Subject Mapping not found');
    return data;
  }

  async create(dto: SubjectMappingCreateDto) {
    return this.repo.createAsync(dto);
  }

  async update(id: number, dto: SubjectMappingCreateDto) {
    const success = await this.repo.updateAsync(id, dto);
    if (!success) throw new NotFoundException('Subject Mapping not found');
    return 'Updated Successfully';
  }

  async delete(id: number, deletedBy: string) {
    const success = await this.repo.deleteAsync(id, deletedBy || 'ADMIN');
    if (!success) throw new NotFoundException('Subject Mapping not found');
    return 'Deleted Successfully';
  }
}
