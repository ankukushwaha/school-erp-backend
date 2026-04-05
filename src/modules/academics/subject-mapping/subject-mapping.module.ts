import { Module } from '@nestjs/common';
import { SubjectMappingController } from './subject-mapping.controller';
import { SubjectMappingService } from './subject-mapping.service';
import { SubjectMappingRepository } from './subject-mapping.repository';

@Module({
  controllers: [SubjectMappingController],
  providers: [SubjectMappingService, SubjectMappingRepository],
})
export class SubjectMappingModule {}
