import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class AcademicCalendarRepository {
  constructor(private readonly db: DatabaseService) { }

  async createAcademicCalendar(calendar: any): Promise<number> {
    const query = `
      INSERT INTO m_academic_calendar
      (
          academic_year_id,
          school_id,
          class_id,
          is_all_classes,
          event_type_id,
          event_title,
          event_description,
          start_date,
          end_date,
          is_holiday
      )
      VALUES
      (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING academic_calendar_id AS "academicCalendarId"
    `;
    const result = await this.db.query(query, [
      calendar.academicYearId,
      calendar.schoolId,
      calendar.classId,
      calendar.isAllClasses,
      calendar.eventTypeId,
      calendar.eventTitle,
      calendar.eventDescription,
      calendar.startDate,
      calendar.endDate,
      calendar.isHoliday,
    ]);
    return result[0]?.academicCalendarId;
  }

  async getAllAcademicCalendars() {
    const query = `
      SELECT
          ac.academic_calendar_id AS "academicCalendarId",
          ac.academic_year_id AS "academicYearId",
          ay.academic_year AS "academicYearName",
          ac.school_id AS "schoolId",
          ac.class_id AS "classId",
          c.class_name AS "className",
          ac.is_all_classes AS "isAllClasses",
          ac.event_type_id AS "eventTypeId",
          et.event_type_name AS "eventTypeName",
          ac.event_title AS "eventTitle",
          ac.event_description AS "eventDescription",
          ac.start_date AS "startDate",
          ac.end_date AS "endDate",
          ac.is_holiday AS "isHoliday"
      FROM m_academic_calendar ac
      LEFT JOIN m_academic_year ay
          ON ac.academic_year_id = ay.academic_year_id AND ay.del_status = FALSE
      LEFT JOIN m_class c
          ON ac.class_id = c.class_id AND c.del_status = FALSE
      LEFT JOIN m_event_type et
          ON ac.event_type_id = et.event_type_id AND et.del_status = FALSE
      WHERE ac.del_status = FALSE
      ORDER BY ac.start_date
    `;
    return this.db.query(query);
  }

  async getAcademicCalendarById(id: number) {
    const query = `
      SELECT
          ac.academic_calendar_id AS "academicCalendarId",
          ac.academic_year_id AS "academicYearId",
          ay.academic_year AS "academicYearName",
          ac.school_id AS "schoolId",
          ac.class_id AS "classId",
          c.class_name AS "className",
          ac.is_all_classes AS "isAllClasses",
          ac.event_type_id AS "eventTypeId",
          et.event_type_name AS "eventTypeName",
          ac.event_title AS "eventTitle",
          ac.event_description AS "eventDescription",
          ac.start_date AS "startDate",
          ac.end_date AS "endDate",
          ac.is_holiday AS "isHoliday"
      FROM m_academic_calendar ac
      LEFT JOIN m_academic_year ay
          ON ac.academic_year_id = ay.academic_year_id AND ay.del_status = FALSE
      LEFT JOIN m_class c
          ON ac.class_id = c.class_id AND c.del_status = FALSE
      LEFT JOIN m_event_type et
          ON ac.event_type_id = et.event_type_id AND et.del_status = FALSE
      WHERE ac.academic_calendar_id = $1 AND ac.del_status = FALSE
    `;
    const result = await this.db.query(query, [id]);
    return result[0] || null;
  }

  async updateAcademicCalendar(calendar: any): Promise<boolean> {
    const query = `
      UPDATE m_academic_calendar
      SET
          academic_year_id = $1,
          school_id = $2,
          class_id = $3,
          is_all_classes = $4,
          event_type_id = $5,
          event_title = $6,
          event_description = $7,
          start_date = $8,
          end_date = $9,
          is_holiday = $10,
          edit_on_dt = CURRENT_TIMESTAMP
      WHERE academic_calendar_id = $11
        AND del_status = FALSE
      RETURNING academic_calendar_id
    `;
    const result = await this.db.query(query, [
      calendar.academicYearId,
      calendar.schoolId,
      calendar.classId,
      calendar.isAllClasses,
      calendar.eventTypeId,
      calendar.eventTitle,
      calendar.eventDescription,
      calendar.startDate,
      calendar.endDate,
      calendar.isHoliday,
      calendar.academicCalendarId,
    ]);
    return result.length > 0;
  }

  async deleteAcademicCalendar(id: number): Promise<boolean> {
    const query = `
      UPDATE m_academic_calendar
      SET
          del_status = TRUE,
          del_on_dt = CURRENT_TIMESTAMP
      WHERE academic_calendar_id = $1
      RETURNING academic_calendar_id
    `;
    const result = await this.db.query(query, [id]);
    return result.length > 0;
  }
}
