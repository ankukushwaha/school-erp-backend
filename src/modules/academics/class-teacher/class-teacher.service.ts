import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ClassTeacherRepository } from './class-teacher.repository';
import { CreateClassTeacherDto, UpdateClassTeacherDto } from './dto/class-teacher.dto';

@Injectable()
export class ClassTeacherService {
  constructor(private readonly repo: ClassTeacherRepository) {}

  async getAll() {
    return this.repo.getAllAsync();
  }

  async getById(id: number) {
    const data = await this.repo.getByIdAsync(id);
    if (!data) throw new NotFoundException('Class Teacher mapping not found');
    return data;
  }

  async create(dto: CreateClassTeacherDto) {
    const exists = await this.repo.checkExistsAsync(dto.academicYearId, dto.classId, dto.sectionId);
    if (exists) {
      throw new ConflictException('A class teacher is already allocated for this class and section in the selected academic year.');
    }
    return this.repo.createAsync(dto);
  }

  async update(id: number, dto: UpdateClassTeacherDto) {
    const exists = await this.repo.checkExistsAsync(dto.academicYearId, dto.classId, dto.sectionId, id);
    if (exists) {
      throw new ConflictException('A class teacher is already allocated for this class and section in the selected academic year.');
    }
    
    const success = await this.repo.updateAsync(id, dto);
    if (!success) throw new NotFoundException('Class Teacher mapping not found');
    return success;
  }

  async delete(id: number, deletedBy: string) {
    const success = await this.repo.deleteAsync(id, deletedBy);
    if (!success) throw new NotFoundException('Class Teacher mapping not found');
    return success;
  }
}
