import { Module } from '@nestjs/common';
import { StudentDocumentController } from './student-document.controller';
import { StudentDocumentService } from './student-document.service';
import { StudentDocumentRepository } from './student-document.repository';

@Module({
  controllers: [StudentDocumentController],
  providers: [StudentDocumentService, StudentDocumentRepository],
})
export class StudentDocumentModule {}
