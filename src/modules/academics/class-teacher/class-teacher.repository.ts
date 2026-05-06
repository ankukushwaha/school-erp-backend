import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class ClassTeacherRepository {
  constructor(private readonly db: DatabaseService) { }

  private get classTeacherColumns() {
    return `
        ct.class_teacher_id AS "classTeacherId",
        ct.academic_year_id AS "academicYearId",
        ay.academic_year AS "academicYearName",
        ct.school_id AS "schoolId",
        ct.class_id AS "classId",
        c.class_name AS "className",
        ct.section_id AS "sectionId",
        s.section_name AS "sectionName",
        ct.teacher_id AS "teacherId",
        TRIM(CONCAT(e.first_name, ' ', e.last_name)) AS "teacherName",
        e.email AS "email",
        e.mobile_no AS "phone",
        ct.is_active AS "isActive"
      FROM m_class_teacher ct
      LEFT JOIN m_class c ON ct.class_id = c.class_id
      LEFT JOIN m_section_lookup s ON ct.section_id = s.section_id
      LEFT JOIN m_academic_year ay ON ct.academic_year_id = ay.academic_year_id
      LEFT JOIN s_employee e ON ct.teacher_id = e.employee_id
    `;
  }

  async getAllAsync() {
    const sql = `
      SELECT ${this.classTeacherColumns}
      WHERE ct.del_status = false
      ORDER BY ct.class_teacher_id
    `;
    return this.db.query(sql);
  }

  async getByIdAsync(id: number) {
    const sql = `
      SELECT ${this.classTeacherColumns}
      WHERE ct.class_teacher_id = $1
      AND ct.del_status = false
    `;
    const rows = await this.db.query(sql, [id]);
    return rows[0] || null;
  }

  async createAsync(entity: any) {
    const sql = `
      INSERT INTO m_class_teacher
      (
          academic_year_id, school_id, class_id, section_id,
          teacher_id, is_active, auth_add, add_on_dt, del_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), false)
      RETURNING class_teacher_id AS "classTeacherId"
    `;
    const rows = await this.db.query(sql, [
      entity.academicYearId,
      entity.schoolId,
      entity.classId,
      entity.sectionId,
      entity.teacherId,
      entity.isActive,
      entity.authAdd || 'ADMIN'
    ]);
    return rows[0]?.classTeacherId;
  }

  async updateAsync(id: number, entity: any) {
    const sql = `
      UPDATE m_class_teacher
      SET
          academic_year_id = $1,
          school_id = $2,
          class_id = $3,
          section_id = $4,
          teacher_id = $5,
          is_active = $6,
          auth_lst_edt = $7,
          edit_on_dt = CURRENT_TIMESTAMP
      WHERE class_teacher_id = $8
      AND del_status = false
      RETURNING class_teacher_id
    `;
    const result = await this.db.query(sql, [
      entity.academicYearId,
      entity.schoolId,
      entity.classId,
      entity.sectionId,
      entity.teacherId,
      entity.isActive,
      entity.authLstEdt || 'ADMIN',
      id
    ]);
    return result.length > 0;
  }

  async deleteAsync(id: number, deletedBy: string) {
    const sql = `
      UPDATE m_class_teacher
      SET
          del_status = true,
          auth_del = $1,
          del_on_dt = CURRENT_TIMESTAMP
      WHERE class_teacher_id = $2
      RETURNING class_teacher_id
    `;
    const result = await this.db.query(sql, [deletedBy, id]);
    return result.length > 0;
  }
}
