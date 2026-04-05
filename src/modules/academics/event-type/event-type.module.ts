import { Module } from '@nestjs/common';
import { EventTypeController } from './event-type.controller';
import { EventTypeService } from './event-type.service';
import { EventTypeRepository } from './event-type.repository';

@Module({
  controllers: [EventTypeController],
  providers: [EventTypeService, EventTypeRepository],
})
export class EventTypeModule {}
