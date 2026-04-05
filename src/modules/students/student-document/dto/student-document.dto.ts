export class StudentDocumentDto {
  studentDocumentId: number;
  documentName: string;
  documentCode: string;
  description?: string;
  isMandatory: boolean;
  isActive: boolean;
}

export class CreateStudentDocumentDto {
  documentName: string;
  documentCode: string;
  description?: string;
  isMandatory: boolean;
  isActive: boolean;
  authAdd?: string;
}
