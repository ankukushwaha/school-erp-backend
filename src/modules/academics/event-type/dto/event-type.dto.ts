export class EventTypeCreateDto {
  eventTypeName: string;
  description?: string;
}

export class EventTypeUpdateDto extends EventTypeCreateDto {
  eventTypeId: number;
  isActive: boolean;
}
