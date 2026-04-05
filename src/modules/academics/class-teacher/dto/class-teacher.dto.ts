export class ClassTeacherDto {
  classTeacherId: number;
  academicYearId: number;
  schoolId: number;
  classId: number;
  sectionId: number;
  teacherId: number;
  isActive: boolean;
  addOnDt?: Date;
}

export class CreateClassTeacherDto {
  academicYearId: number;
  schoolId: number;
  classId: number;
  sectionId: number;
  teacherId: number;
  isActive: boolean;
  authAdd?: string;
}

export class UpdateClassTeacherDto extends CreateClassTeacherDto {
  authLstEdt?: string;
}
