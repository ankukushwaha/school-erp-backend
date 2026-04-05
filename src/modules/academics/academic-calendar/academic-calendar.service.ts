import { Injectable, NotFoundException } from '@nestjs/common';
import { AcademicCalendarRepository } from './academic-calendar.repository';
import { CreateAcademicCalendarDto, UpdateAcademicCalendarDto } from './dto/academic-calendar.dto';

@Injectable()
export class AcademicCalendarService {
  constructor(private readonly repo: AcademicCalendarRepository) {}

  async create(dto: CreateAcademicCalendarDto) {
    return this.repo.createAcademicCalendar(dto);
  }

  async getAll() {
    return this.repo.getAllAcademicCalendars();
  }

  async getById(id: number) {
    const data = await this.repo.getAcademicCalendarById(id);
    if (!data) {
      throw new NotFoundException('Academic Calendar not found');
    }
    return data;
  }

  async update(dto: UpdateAcademicCalendarDto) {
    return this.repo.updateAcademicCalendar(dto);
  }

  async delete(id: number) {
    return this.repo.deleteAcademicCalendar(id);
  }
}
