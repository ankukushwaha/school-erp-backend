import { Module } from '@nestjs/common';
import { ClassTeacherController } from './class-teacher.controller';
import { ClassTeacherService } from './class-teacher.service';
import { ClassTeacherRepository } from './class-teacher.repository';

@Module({
  controllers: [ClassTeacherController],
  providers: [ClassTeacherService, ClassTeacherRepository],
})
export class ClassTeacherModule {}
