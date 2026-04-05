import { Injectable, NotFoundException } from '@nestjs/common';
import { SchoolRepository } from './school.repository';
import { MSchoolDto, UpdateSchoolDto } from './dto/school.dto';

@Injectable()
export class SchoolService {
  constructor(private readonly schoolRepository: SchoolRepository) {}

  async getAllSchools() {
    return this.schoolRepository.getAllAsync();
  }

  async getSchoolById(id: number) {
    const school = await this.schoolRepository.getByIdAsync(id);
    if (!school) {
      throw new NotFoundException('School not found');
    }
    return school;
  }

  async createSchool(dto: MSchoolDto, logoFile?: any) {
    const schoolToCreate: any = {
      ...dto,
      logo: logoFile ? logoFile.buffer : null,
      logoName: logoFile ? logoFile.originalname : null,
      logoType: logoFile ? logoFile.mimetype : null,
      authAdd: 'ADMIN' // Matching Sigma mock
    };

    const id = await this.schoolRepository.createAsync(schoolToCreate);
    return { SchoolId: id };
  }

  async updateSchool(id: number, dto: UpdateSchoolDto, logoFile?: any) {
    const schoolToUpdate: any = {
      ...dto,
      logo: logoFile ? logoFile.buffer : null,
      logoName: logoFile ? logoFile.originalname : null,
      logoType: logoFile ? logoFile.mimetype : null,
      authLstEdt: 'ADMIN'
    };

    const result = await this.schoolRepository.updateAsync(id, schoolToUpdate);
    if (!result) {
      throw new NotFoundException('School not found');
    }
    return 'School Updated Successfully';
  }
}
