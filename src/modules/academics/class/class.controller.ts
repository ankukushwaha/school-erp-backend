import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';

@Controller('master/class')
export class ClassController {
  constructor(private readonly service: ClassService) {}

  @Get()
  async getAll() {
    return this.service.getAllAsync();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getByIdAsync(id);
  }

  @Post()
  async create(@Body() dto: CreateClassDto) {
    const message = await this.service.createAsync(dto);
    return { message };
  }

  @Put()
  async update(@Body() dto: UpdateClassDto) {
    const message = await this.service.updateAsync(dto);
    return { message };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const message = await this.service.deleteAsync(id);
    return { message };
  }
}
