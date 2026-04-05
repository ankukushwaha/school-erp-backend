export class CreateClassDto {
  className: string;
  classCode: string;
  classOrder: number;
  maximumCapacity: number;
  description?: string;
}

export class UpdateClassDto extends CreateClassDto {
  classId: number;
}
