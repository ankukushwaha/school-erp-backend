import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { CreateSyllabusDto, UpdateSyllabusDto } from './dto/syllabus.dto';

@Injectable()
export class SyllabusRepository {
  constructor(private readonly db: DatabaseService) { }

  private get syllabusColumns() {
    return `
      s.syllabus_id AS "id",
      s.subject_id AS "subjectId",
      sub.subject_name AS "subjectName",
      s.class_id AS "classId",
      c.class_name AS "className",
      s.term_name AS "term",
      s.total_topics AS "totalTopics",
      s.completed_topics AS "completedTopics",
      s.status AS "status",
      s.edit_on_dt AS "lastUpdated",
      s.add_on_dt AS "createdDate",
      s.document AS "document",
      s.academic_year AS "academicYear"
    `;
  }

  async getAllAsync(classId?: number) {
    let sql = `
      SELECT ${this.syllabusColumns}
      FROM syllabus s
      LEFT JOIN m_class c ON s.class_id = c.class_id
      LEFT JOIN m_subject sub ON s.subject_id = sub.subject_id
      WHERE s.del_status = false
    `;
    const params: (string | number)[] = [];
    if (classId) {
      sql += ` AND s.class_id = $1`;
      params.push(classId);
    }
    sql += ` ORDER BY s.syllabus_id DESC`;

    const rows = await this.db.query(sql, params);
    return rows.map((r: Record<string, any>) => ({
      ...r,
      lastUpdated: r.lastUpdated || r.createdDate
    }));
  }

  async getByIdAsync(id: number) {
    const sql = `
      SELECT ${this.syllabusColumns}
      FROM syllabus s
      LEFT JOIN m_class c ON s.class_id = c.class_id
      LEFT JOIN m_subject sub ON s.subject_id = sub.subject_id
      WHERE s.syllabus_id = $1 AND s.del_status = false
    `;
    const rows = await this.db.query(sql, [id]);
    const r = rows[0];
    if (!r) return null;
    return {
      ...r,
      lastUpdated: r.lastUpdated || r.createdDate
    };
  }

  async createAsync(entity: CreateSyllabusDto) {
    const sql = `
      INSERT INTO syllabus (
        class_id, subject_id, term_name, total_topics, completed_topics,
        document, status, academic_year, auth_add, add_on_dt, del_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), false)
      RETURNING syllabus_id AS "id"
    `;
    const rows = await this.db.query(sql, [
      entity.classId,
      entity.subjectId,
      entity.termName,
      entity.totalTopics || 0,
      entity.completedTopics || 0,
      entity.document,
      entity.status || 'On Track',
      entity.academicYear,
      'ADMIN'
    ]);
    return rows[0]?.id as number;
  }

  async updateAsync(id: number, entity: UpdateSyllabusDto) {
    const sql = `
      UPDATE syllabus
      SET
        class_id = COALESCE($1, class_id),
        subject_id = COALESCE($2, subject_id),
        term_name = COALESCE($3, term_name),
        total_topics = COALESCE($4, total_topics),
        completed_topics = COALESCE($5, completed_topics),
        document = COALESCE($6, document),
        status = COALESCE($7, status),
        academic_year = COALESCE($8, academic_year),
        auth_lst_edt = $9,
        edit_on_dt = CURRENT_TIMESTAMP
      WHERE syllabus_id = $10 AND del_status = false
      RETURNING syllabus_id
    `;
    const result = await this.db.query(sql, [
      entity.classId,
      entity.subjectId,
      entity.termName,
      entity.totalTopics,
      entity.completedTopics,
      entity.document,
      entity.status,
      entity.academicYear,
      'ADMIN',
      id
    ]);
    return result.length > 0;
  }

  async deleteAsync(id: number) {
    const sql = `
      UPDATE syllabus
      SET del_status = true, auth_del = $1, del_on_dt = CURRENT_TIMESTAMP
      WHERE syllabus_id = $2
      RETURNING syllabus_id
    `;
    const result = await this.db.query(sql, ['ADMIN', id]);
    return result.length > 0;
  }

  async checkExistsAsync(classId: number, subjectId: number, termName: string, academicYear: string, excludeId?: number) {
    let sql = `
      SELECT syllabus_id 
      FROM syllabus 
      WHERE class_id = $1 
        AND subject_id = $2 
        AND term_name = $3 
        AND academic_year = $4 
        AND del_status = false
    `;
    const params: (string | number)[] = [classId, subjectId, termName, academicYear];

    if (excludeId) {
      sql += ` AND syllabus_id <> $5`;
      params.push(excludeId);
    }

    const rows = await this.db.query(sql, params);
    return rows.length > 0;
  }
}
