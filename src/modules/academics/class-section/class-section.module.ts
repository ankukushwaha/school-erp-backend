import { Module } from '@nestjs/common';
import { ClassSectionController } from './class-section.controller';
import { ClassSectionService } from './class-section.service';
import { ClassSectionRepository } from './class-section.repository';

@Module({
  controllers: [ClassSectionController],
  providers: [ClassSectionService, ClassSectionRepository],
})
export class ClassSectionModule {}
