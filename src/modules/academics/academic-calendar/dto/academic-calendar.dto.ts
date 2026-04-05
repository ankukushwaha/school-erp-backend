export class CreateAcademicCalendarDto {
  academicYearId: number;
  schoolId: number;
  classId?: number | null;
  isAllClasses: boolean;
  eventTypeId?: number | null;
  eventTitle: string;
  eventDescription?: string;
  startDate: string;
  endDate: string;
  isHoliday: boolean;
}

export class UpdateAcademicCalendarDto extends CreateAcademicCalendarDto {
  academicCalendarId: number;
}
