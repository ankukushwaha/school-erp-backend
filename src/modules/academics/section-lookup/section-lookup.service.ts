import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SectionLookupRepository } from './section-lookup.repository';
import { SectionLookupCreateDto, SectionLookupUpdateDto } from './dto/section-lookup.dto';

@Injectable()
export class SectionLookupService {
  constructor(private readonly repo: SectionLookupRepository) {}

  async getAllAsync() {
    return this.repo.getAllAsync();
  }

  async getByIdAsync(id: number) {
    const data = await this.repo.getByIdAsync(id);
    if (!data) throw new NotFoundException('Section not found');
    return data;
  }

  async createAsync(dto: SectionLookupCreateDto) {
    const existing = await this.repo.getByNameAsync(dto.sectionName);
    if (existing) throw new BadRequestException('Section with this name already exists');
    return this.repo.addAsync(dto);
  }

  async updateAsync(dto: SectionLookupUpdateDto) {
    const existing = await this.repo.getByIdAsync(dto.sectionId);
    if (!existing) throw new NotFoundException('Section not found');
    return this.repo.updateAsync(dto);
  }

  async deleteAsync(id: number, deletedBy: string) {
    const existing = await this.repo.getByIdAsync(id);
    if (!existing) throw new NotFoundException('Section not found');
    return this.repo.softDeleteAsync(id, deletedBy);
  }
}
