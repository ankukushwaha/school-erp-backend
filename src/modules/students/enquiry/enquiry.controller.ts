import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';

@Controller('Enquiry')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) {}

  @Get()
  async getAll() {
    return this.enquiryService.getAll();
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return this.enquiryService.getById(id);
  }

  @Post()
  async create(@Body() dto: CreateEnquiryDto) {
    return this.enquiryService.create(dto);
  }

  @Put()
  async update(@Body() dto: UpdateEnquiryDto) {
    return this.enquiryService.update(dto);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @Query('authDel') authDel: string,
  ) {
    return this.enquiryService.delete(id, authDel);
  }
}
