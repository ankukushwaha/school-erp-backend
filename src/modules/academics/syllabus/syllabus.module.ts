import { Module } from '@nestjs/common';
import { SyllabusController } from './syllabus.controller';
import { SyllabusService } from './syllabus.service';
import { SyllabusRepository } from './syllabus.repository';
import { DatabaseModule } from '../../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SyllabusController],
  providers: [SyllabusService, SyllabusRepository],
})
export class SyllabusModule {}
