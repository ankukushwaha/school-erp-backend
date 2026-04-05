import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassRepository } from './class.repository';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';

@Injectable()
export class ClassService {
  constructor(private readonly repo: ClassRepository) {}

  async getAllAsync() {
    return this.repo.getAllAsync();
  }

  async getByIdAsync(id: number) {
    const data = await this.repo.getByIdAsync(id);
    if (!data) {
      throw new NotFoundException('Class not found');
    }
    return data;
  }

  async createAsync(dto: CreateClassDto) {
    const id = await this.repo.createAsync(dto);
    return 'Class Created Successfully';
  }

  async updateAsync(dto: UpdateClassDto) {
    const result = await this.repo.updateAsync(dto);
    if (!result) throw new NotFoundException('Class not found');
    return 'Class Updated Successfully';
  }

  async deleteAsync(id: number) {
    const result = await this.repo.deleteAsync(id);
    if (!result) throw new NotFoundException('Class not found');
    return 'Class Deleted Successfully';
  }
}
