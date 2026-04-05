import { Module } from '@nestjs/common';
import { EnquiryModule } from './enquiry/enquiry.module';

@Module({
  imports: [EnquiryModule],
})
export class StudentsModule {}
