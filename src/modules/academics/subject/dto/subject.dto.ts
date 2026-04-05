export class SubjectDto {
  subjectName: string;
  subjectCode: string;
  isOptional: boolean;
  subjectType: string;
  category: string;
  description?: string;
  minMarks: number;
  maxMarks: number;
  passMarks: number;
}

export class UpdateSubjectDto extends SubjectDto {
  subjectId: number;
}
