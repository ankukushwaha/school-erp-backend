import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class SubjectMappingRepository {
  constructor(private readonly db: DatabaseService) {}

  private get baseQuery() {
    return `
      SELECT  
          sm.subject_mapping_id AS "subjectMappingId",
          sm.academic_year_id AS "academicYearId",
          ay.academic_year AS "academicYearName",
          sm.school_id AS "schoolId",
          sc.school_name AS "schoolName",
          sm.class_id AS "classId",
          c.class_name AS "className",
          sm.section_id AS "sectionId",
          sec.section_name AS "sectionName",
          sm.is_all_sections AS "isAllSections",
          sm.term_id AS "termId",
          t.term_name AS "termName",
          sm.subject_id AS "subjectId",
          sub.subject_name AS "subjectName",
          sm.periods_per_week AS "periodsPerWeek",
          sm.subject_type AS "subjectType",
          sm.is_active AS "isActive",
          sm.auth_add AS "authAdd",
          sm.auth_lst_edt AS "authLstEdt",
          sm.auth_del AS "authDel",
          sm.add_on_dt AS "addOnDt",
          sm.edit_on_dt AS "editOnDt",
          sm.del_on_dt AS "delOnDt",
          sm.del_status AS "delStatus"
      FROM s_master.m_subject_mapping sm
      LEFT JOIN s_master.m_academic_year ay ON sm.academic_year_id = ay.academic_year_id
      LEFT JOIN s_master.m_school sc ON sm.school_id = sc.school_id
      LEFT JOIN s_master.m_class c ON sm.class_id = c.class_id
      LEFT JOIN s_master.m_section_lookup sec ON sm.section_id = sec.section_id
      LEFT JOIN s_master.m_subject sub ON sm.subject_id = sub.subject_id
      LEFT JOIN s_master.m_academic_year_term t ON sm.term_id = t.term_id
      WHERE sm.del_status = false
    `;
  }

  async getAllAsync() {
    const query = `${this.baseQuery} ORDER BY sm.subject_mapping_id DESC`;
    return this.db.query(query);
  }

  async getByIdAsync(id: number) {
    const query = `${this.baseQuery} AND sm.subject_mapping_id = $1`;
    const result = await this.db.query(query, [id]);
    return result[0] || null;
  }

  async createAsync(dto: any) {
    const checkSql = `
      SELECT 1 FROM s_master.m_subject_mapping
      WHERE academic_year_id = $1
      AND class_id = $2
      AND section_id IS NOT DISTINCT FROM $3
      AND subject_id = $4
      AND term_id = $5
      AND del_status = false
    `;
    const exists = await this.db.query(checkSql, [
      dto.academicYearId,
      dto.classId,
      dto.sectionId || null,
      dto.subjectId,
      dto.termId
    ]);

    if (exists.length > 0) {
      throw new BadRequestException('Duplicate subject mapping not allowed');
    }

    const sql = `
      INSERT INTO s_master.m_subject_mapping
      (
          academic_year_id, school_id, class_id, section_id, is_all_sections,
          term_id, subject_id, periods_per_week, subject_type, auth_add
      )
      VALUES
      (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
      RETURNING subject_mapping_id AS "subjectMappingId"
    `;
    const result = await this.db.query(sql, [
      dto.academicYearId,
      dto.schoolId,
      dto.classId,
      dto.sectionId,
      dto.isAllSections,
      dto.termId,
      dto.subjectId,
      dto.periodsPerWeek,
      dto.subjectType,
      dto.authAdd || 'ADMIN'
    ]);

    return result[0]?.subjectMappingId;
  }

  async updateAsync(id: number, dto: any) {
    const sql = `
      UPDATE s_master.m_subject_mapping
      SET
          academic_year_id = $1,
          school_id = $2,
          class_id = $3,
          section_id = $4,
          is_all_sections = $5,
          term_id = $6,
          subject_id = $7,
          periods_per_week = $8,
          subject_type = $9,
          auth_lst_edt = $10,
          edit_on_dt = CURRENT_TIMESTAMP
      WHERE subject_mapping_id = $11
    `;
    const result = await this.db.query(sql, [
      dto.academicYearId,
      dto.schoolId,
      dto.classId,
      dto.sectionId,
      dto.isAllSections,
      dto.termId,
      dto.subjectId,
      dto.periodsPerWeek,
      dto.subjectType,
      dto.authAdd || 'ADMIN',
      id
    ]);
    return result.length > 0;
  }

  async deleteAsync(id: number, deletedBy: string) {
    const sql = `
      UPDATE s_master.m_subject_mapping
      SET
          del_status = true,
          auth_del = $1,
          del_on_dt = CURRENT_TIMESTAMP
      WHERE subject_mapping_id = $2
      RETURNING subject_mapping_id
    `;
    const result = await this.db.query(sql, [deletedBy, id]);
    return result.length > 0;
  }
}
