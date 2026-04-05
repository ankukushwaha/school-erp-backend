import { Module } from '@nestjs/common';
import { AcademicYearModule } from './academic-year/academic-year.module';
import { AcademicCalendarModule } from './academic-calendar/academic-calendar.module';
import { ClassModule } from './class/class.module';
import { ClassSectionModule } from './class-section/class-section.module';
import { SubjectModule } from './subject/subject.module';
import { SubjectMappingModule } from './subject-mapping/subject-mapping.module';
import { SectionLookupModule } from './section-lookup/section-lookup.module';
import { EventTypeModule } from './event-type/event-type.module';
import { ClassTeacherModule } from './class-teacher/class-teacher.module';

@Module({
  imports: [
    AcademicYearModule,
    AcademicCalendarModule,
    ClassModule,
    ClassSectionModule,
    SubjectModule,
    SubjectMappingModule,
    SectionLookupModule,
    EventTypeModule,
    ClassTeacherModule,
  ],
})
export class AcademicsModule {}
