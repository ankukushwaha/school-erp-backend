export class SubjectMappingCreateDto {
  academicYearId: number;
  schoolId?: number | null;
  classId: number;
  sectionId?: number | null;
  isAllSections: boolean;
  termId: number;
  subjectId: number;
  periodsPerWeek: number;
  subjectType: string;
  authAdd?: string;
}
