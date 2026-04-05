import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { SchoolRepository } from './school.repository';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, SchoolRepository],
})
export class SchoolModule {}
