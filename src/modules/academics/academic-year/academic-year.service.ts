import { Injectable, BadRequestException } from '@nestjs/common';
import { AcademicYearRepository } from './academic-year.repository';
import { AcademicYearCreateDto, AcademicYearUpdateDto } from './dto/academic-year.dto';

@Injectable()
export class AcademicYearService {
  constructor(private readonly repo: AcademicYearRepository) {}

  async getAllAsync() {
    return this.repo.getAllWithTermsAsync();
  }

  async getByIdAsync(id: number) {
    return this.repo.getAcademicYearWithTerms(id);
  }

  async createAsync(dto: AcademicYearCreateDto) {
    if (new Date(dto.startDate) >= new Date(dto.endDate)) {
      throw new BadRequestException('Start date must be less than end date');
    }

    if (await this.repo.existsAsync(dto.academicYearName)) {
      throw new BadRequestException('Academic year already exists');
    }

    const academicYearId = await this.repo.createAsync({
      academicYearName: dto.academicYearName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      isActive: false,
    });

    if (dto.terms && dto.terms.length > 0) {
      const terms = dto.terms.map((t) => ({
        academicYearId,
        termName: t.termName,
        startDate: t.startDate,
        endDate: t.endDate,
        workingDays: t.workingDays,
      }));
      await this.repo.insertTermsAsync(terms);
    }

    return 'Academic year with terms created successfully';
  }

  async updateAsync(dto: AcademicYearUpdateDto) {
    const result = await this.repo.updateAsync({
      academicYearId: dto.academicYearId,
      academicYearName: dto.academicYearName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      isActive: dto.isActive,
    });

    if (!result) {
      throw new BadRequestException('Update failed');
    }

    if (dto.terms) {
      for (const term of dto.terms) {
        if (term.termId && term.termId > 0) {
          await this.repo.updateTermAsync(term);
        } else {
          await this.repo.insertTermAsync({
            academicYearId: dto.academicYearId,
            ...term,
          });
        }
      }
    }

    return 'Academic year updated successfully';
  }

  async deleteAsync(id: number) {
    const result = await this.repo.deleteAsync(id);
    if (!result) {
      throw new BadRequestException('Delete failed');
    }
    return 'Deleted successfully';
  }
}
