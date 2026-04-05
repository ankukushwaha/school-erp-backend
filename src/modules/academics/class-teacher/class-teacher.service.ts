import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.repo.createAsync(dto);
  }

  async update(id: number, dto: UpdateClassTeacherDto) {
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
