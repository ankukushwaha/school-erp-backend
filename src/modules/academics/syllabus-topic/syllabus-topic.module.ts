import { Module } from '@nestjs/common';
import { SyllabusTopicController } from './syllabus-topic.controller';
import { SyllabusTopicService } from './syllabus-topic.service';
import { SyllabusTopicRepository } from './syllabus-topic.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SyllabusTopicController],
  providers: [SyllabusTopicService, SyllabusTopicRepository],
  exports: [SyllabusTopicService],
})
export class SyllabusTopicModule {}
