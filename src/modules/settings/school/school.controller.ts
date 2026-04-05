import { Controller, Get, Param, Post, Put, Body, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { SchoolService } from './school.service';
import { MSchoolDto, UpdateSchoolDto } from './dto/school.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('MSchool')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  async getSchools() {
    return this.schoolService.getAllSchools();
  }

  @Get(':id')
  async getSchool(@Param('id', ParseIntPipe) id: number) {
    return this.schoolService.getSchoolById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('Logo'))
  async create(
    @Body() dto: MSchoolDto,
    @UploadedFile() logoFile: any
  ) {
    // Map DTO from PascalCase FormData coming from frontend to camelCase standard NestJS
    // Note: Since FormData uses PascalCase internally on frontend mapping, we must assign here explicitly
    const mappedDto: MSchoolDto = {
      schoolCode: dto['SchoolCode'] || dto.schoolCode,
      schoolName: dto['SchoolName'] || dto.schoolName,
      principalName: dto['PrincipalName'] || dto.principalName,
      email: dto['Email'] || dto.email,
      phoneNumber: dto['PhoneNumber'] || dto.phoneNumber,
      addressLine1: dto['AddressLine1'] || dto.addressLine1,
      addressLine2: dto['AddressLine2'] || dto.addressLine2,
      city: dto['City'] || dto.city,
      state: dto['State'] || dto.state,
      country: dto['Country'] || dto.country,
      postalCode: dto['PostalCode'] || dto.postalCode,
    };
    
    return this.schoolService.createSchool(mappedDto, logoFile);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('Logo'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSchoolDto,
    @UploadedFile() logoFile: any
  ) {
    const mappedDto: UpdateSchoolDto = {
      schoolCode: dto['SchoolCode'] || dto.schoolCode,
      schoolName: dto['SchoolName'] || dto.schoolName,
      principalName: dto['PrincipalName'] || dto.principalName,
      email: dto['Email'] || dto.email,
      phoneNumber: dto['PhoneNumber'] || dto.phoneNumber,
      addressLine1: dto['AddressLine1'] || dto.addressLine1,
      addressLine2: dto['AddressLine2'] || dto.addressLine2,
      city: dto['City'] || dto.city,
      state: dto['State'] || dto.state,
      country: dto['Country'] || dto.country,
      postalCode: dto['PostalCode'] || dto.postalCode,
    };

    return this.schoolService.updateSchool(id, mappedDto, logoFile);
  }
}
