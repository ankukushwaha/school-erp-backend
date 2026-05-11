import { Module } from '@nestjs/common';
import { SyllabusChapterController } from './syllabus-chapter.controller';
import { SyllabusChapterService } from './syllabus-chapter.service';
import { SyllabusChapterRepository } from './syllabus-chapter.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SyllabusChapterController],
  providers: [SyllabusChapterService, SyllabusChapterRepository],
})
export class SyllabusChapterModule {}
