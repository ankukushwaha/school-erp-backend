import { Module } from '@nestjs/common';
import { AcademicYearModule } from './academic-year/academic-year.module';
import { AcademicCalendarModule } from './academic-calendar/academic-calendar.module';
import { ClassModule } from './class/class.module';
import { ClassSectionModule } from './class-section/class-section.module';
import { SubjectModule } from './subject/subject.module';
import { SubjectMappingModule } from './subject-mapping/subject-mapping.module';

@Module({
  imports: [
    AcademicYearModule,
    AcademicCalendarModule,
    ClassModule,
    ClassSectionModule,
    SubjectModule,
    SubjectMappingModule,
  ],
})
export class AcademicsModule {}
