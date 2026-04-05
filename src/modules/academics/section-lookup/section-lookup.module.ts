import { Module } from '@nestjs/common';
import { SectionLookupController } from './section-lookup.controller';
import { SectionLookupService } from './section-lookup.service';
import { SectionLookupRepository } from './section-lookup.repository';

@Module({
  controllers: [SectionLookupController],
  providers: [SectionLookupService, SectionLookupRepository],
})
export class SectionLookupModule {}
