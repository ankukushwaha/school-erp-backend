export class AcademicYearTermDto {
  termId?: number;
  termName: string;
  startDate: string;
  endDate: string;
  workingDays: number;
}

export class AcademicYearCreateDto {
  academicYearName: string;
  startDate: string;
  endDate: string;
  terms?: AcademicYearTermDto[];
}

export class AcademicYearUpdateDto {
  academicYearId: number;
  academicYearName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  terms?: AcademicYearTermDto[];
}
