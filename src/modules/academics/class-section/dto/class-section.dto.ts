export class ClassSectionCreateDto {
  classId: number;
  sectionId: number;
  roomNumber?: string;
  floor?: string;
  sectionCapacity?: number;
  classTeacherId?: number | null;
  classSectionCode?: string;
}

export class ClassSectionUpdateDto extends ClassSectionCreateDto {
  classSectionId: number;
}
