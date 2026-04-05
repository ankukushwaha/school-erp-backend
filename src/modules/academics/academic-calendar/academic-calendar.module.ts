import { Module } from '@nestjs/common';
import { AcademicCalendarController } from './academic-calendar.controller';
import { AcademicCalendarService } from './academic-calendar.service';
import { AcademicCalendarRepository } from './academic-calendar.repository';

@Module({
  controllers: [AcademicCalendarController],
  providers: [AcademicCalendarService, AcademicCalendarRepository],
})
export class AcademicCalendarModule {}
