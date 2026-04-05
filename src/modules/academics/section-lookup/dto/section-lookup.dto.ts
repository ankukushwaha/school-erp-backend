export class SectionLookupCreateDto {
  sectionName: string;
  sectionCode: string;
  authAdd?: string;
}

export class SectionLookupUpdateDto extends SectionLookupCreateDto {
  sectionId: number;
  authLstEdt?: string;
}
