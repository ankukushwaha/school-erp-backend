import { Injectable, BadRequestException } from '@nestjs/common';
import { ClassSectionRepository } from './class-section.repository';
import { ClassSectionCreateDto, ClassSectionUpdateDto } from './dto/class-section.dto';

@Injectable()
export class ClassSectionService {
  constructor(private readonly repo: ClassSectionRepository) {}

  async getAllWithNamesAsync() {
    return this.repo.getAllWithNamesAsync();
  }

  async createAsync(dto: ClassSectionCreateDto) {
    const existing = await this.repo.getByClassAndSectionAsync(dto.classId, dto.sectionId);
    if (existing) {
      throw new BadRequestException('Class section already exists');
    }
    return this.repo.addAsync(dto);
  }

  async updateAsync(dto: ClassSectionUpdateDto) {
    return this.repo.updateAsync(dto);
  }

  async deleteAsync(id: number, deletedBy: string) {
    return this.repo.softDeleteAsync(id, deletedBy || 'ADMIN');
  }
}
