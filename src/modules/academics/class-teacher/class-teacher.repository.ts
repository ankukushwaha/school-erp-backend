import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class ClassTeacherRepository {
  constructor(private readonly db: DatabaseService) { }

  private get classTeacherColumns() {
    return `
      class_teacher_id AS "classTeacherId",
      academic_year_id AS "academicYearId",
      school_id AS "schoolId",
      class_id AS "classId",
      section_id AS "sectionId",
      teacher_id AS "teacherId",
      is_active AS "isActive",
      auth_add AS "authAdd",
      auth_lst_edt AS "authLstEdt",
      auth_del AS "authDel",
      add_on_dt AS "addOnDt",
      edit_on_dt AS "editOnDt",
      del_on_dt AS "delOnDt",
      del_status AS "delStatus"
    `;
  }

  async getAllAsync() {
    const sql = `
      SELECT ${this.classTeacherColumns}
      FROM m_class_teacher
      WHERE del_status = false
      ORDER BY class_teacher_id
    `;
    return this.db.query(sql);
  }

  async getByIdAsync(id: number) {
    const sql = `
      SELECT ${this.classTeacherColumns}
      FROM m_class_teacher
      WHERE class_teacher_id = $1
      AND del_status = false
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
