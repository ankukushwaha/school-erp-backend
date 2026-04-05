import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EventTypeRepository } from './event-type.repository';
import { EventTypeCreateDto, EventTypeUpdateDto } from './dto/event-type.dto';

@Injectable()
export class EventTypeService {
  constructor(private readonly repo: EventTypeRepository) {}

  async create(dto: EventTypeCreateDto) {
    const id = await this.repo.createEventType(dto);
    if (id === -1) {
      throw new BadRequestException('Event Type already exists.');
    }
    return id;
  }

  async getAll() {
    return this.repo.getAllEventTypes();
  }

  async getById(id: number) {
    const data = await this.repo.getEventTypeById(id);
    if (!data) {
      throw new NotFoundException('Event Type not found.');
    }
    return data;
  }

  async update(dto: EventTypeUpdateDto) {
    const success = await this.repo.updateEventType(dto);
    if (!success) {
      throw new BadRequestException('Update failed or duplicate event type.');
    }
    return success;
  }

  async delete(id: number) {
    const success = await this.repo.deleteEventType(id);
    if (!success) {
      throw new NotFoundException('Event Type not found.');
    }
    return success;
  }
}
