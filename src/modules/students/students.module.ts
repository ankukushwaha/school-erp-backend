import { Module } from '@nestjs/common';
import { EnquiryModule } from './enquiry/enquiry.module';
import { StudentDocumentModule } from './student-document/student-document.module';

@Module({
  imports: [EnquiryModule, StudentDocumentModule],
})
export class StudentsModule {}
