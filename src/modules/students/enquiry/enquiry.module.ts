import { Module } from '@nestjs/common';
import { EnquiryController } from './enquiry.controller';
import { EnquiryService } from './enquiry.service';
import { EnquiryRepository } from './enquiry.repository';

@Module({
  controllers: [EnquiryController],
  providers: [EnquiryService, EnquiryRepository],
})
export class EnquiryModule {}
