import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { SectionLookupService } from './section-lookup.service';
import { SectionLookupCreateDto, SectionLookupUpdateDto } from './dto/section-lookup.dto';

@Controller('master/section')
export class SectionLookupController {
  constructor(private readonly service: SectionLookupService) {}

  @Get()
  async getAll() {
    return this.service.getAllAsync();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getByIdAsync(id);
  }

  @Post()
  async create(@Body() dto: SectionLookupCreateDto) {
    const id = await this.service.createAsync(dto);
    return { message: 'Section created successfully', sectionId: id };
  }

  @Put()
  async update(@Body() dto: SectionLookupUpdateDto) {
    await this.service.updateAsync(dto);
    return 'Section updated successfully.';
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Query('deletedBy') deletedBy: string) {
    await this.service.deleteAsync(id, deletedBy || 'ADMIN');
    return 'Section deleted successfully.';
  }
}
