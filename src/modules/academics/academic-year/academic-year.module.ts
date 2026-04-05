import { Module } from '@nestjs/common';
import { AcademicYearController } from './academic-year.controller';
import { AcademicYearService } from './academic-year.service';
import { AcademicYearRepository } from './academic-year.repository';

@Module({
  controllers: [AcademicYearController],
  providers: [AcademicYearService, AcademicYearRepository],
})
export class AcademicYearModule {}
