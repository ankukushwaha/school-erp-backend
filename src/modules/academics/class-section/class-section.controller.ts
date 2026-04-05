import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query } from '@nestjs/common';
import { ClassSectionService } from './class-section.service';
import { ClassSectionCreateDto, ClassSectionUpdateDto } from './dto/class-section.dto';

@Controller('master/class-section')
export class ClassSectionController {
  constructor(private readonly service: ClassSectionService) {}

  @Get()
  async getAll() {
    return this.service.getAllWithNamesAsync();
  }

  @Post()
  async create(@Body() dto: ClassSectionCreateDto) {
    const id = await this.service.createAsync(dto);
    return {
      message: 'Class Section created',
      classSectionId: id,
    };
  }

  @Put()
  async update(@Body() dto: ClassSectionUpdateDto) {
    await this.service.updateAsync(dto);
    return 'Updated successfully';
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Query('deletedBy') deletedBy: string) {
    await this.service.deleteAsync(id, deletedBy);
    return 'Deleted successfully';
  }
}
