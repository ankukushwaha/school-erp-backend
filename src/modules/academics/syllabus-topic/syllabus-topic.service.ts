import { Injectable, NotFoundException } from '@nestjs/common';
import { SyllabusTopicRepository } from './syllabus-topic.repository';
import { CreateSyllabusTopicDto, UpdateSyllabusTopicDto } from './dto/syllabus-topic.dto';

@Injectable()
export class SyllabusTopicService {
  constructor(private readonly repository: SyllabusTopicRepository) { }

  async getAll(syllabusChapterId?: number) {
    return this.repository.getAllAsync(syllabusChapterId);
  }

  async getById(id: number) {
    const topic = await this.repository.getByIdAsync(id);
    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }
    return topic;
  }

  async create(dto: CreateSyllabusTopicDto) {
    return this.repository.createAsync(dto);
  }

  async update(id: number, dto: UpdateSyllabusTopicDto) {
    const success = await this.repository.updateAsync(id, dto);
    if (!success) {
      throw new NotFoundException(`Topic with ID ${id} not found or update failed`);
    }
    return success;
  }

  async delete(id: number) {
    const success = await this.repository.deleteAsync(id);
    if (!success) {
      throw new NotFoundException(`Topic with ID ${id} not found or delete failed`);
    }
    return success;
  }
}
