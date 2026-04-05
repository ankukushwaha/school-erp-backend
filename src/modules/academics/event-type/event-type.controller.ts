import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { EventTypeService } from './event-type.service';
import { EventTypeCreateDto, EventTypeUpdateDto } from './dto/event-type.dto';

@Controller('EventType')
export class EventTypeController {
  constructor(private readonly service: EventTypeService) {}

  @Post()
  async create(@Body() dto: EventTypeCreateDto) {
    const id = await this.service.create(dto);
    return {
      message: 'Event Type created successfully',
      id: id,
    };
  }

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  @Put()
  async update(@Body() dto: EventTypeUpdateDto) {
    await this.service.update(dto);
    return 'Event Type updated successfully.';
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.delete(id);
    return 'Event Type deleted successfully.';
  }
}
