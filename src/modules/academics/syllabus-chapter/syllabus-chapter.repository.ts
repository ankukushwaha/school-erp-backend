import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { CreateSyllabusChapterDto, UpdateSyllabusChapterDto } from './dto/syllabus-chapter.dto';

@Injectable()
export class SyllabusChapterRepository {
  constructor(private readonly db: DatabaseService) { }

  private get chapterColumns() {
    return `
      sc.syllabus_chapter_id AS "syllabusChapterId",
      sc.syllabus_id AS "syllabusId",
      sc.chapter_name AS "chapterName",
      sc.chapter_order AS "chapterOrder",
      sc.is_completed AS "isCompleted",
      COALESCE(s.syllabus_name, s.term_name || ' (' || c.class_name || ' - ' || sub.subject_name || ')') AS "syllabusName"
    `;
  }

  async getAllAsync(syllabusId?: number) {
    let sql = `
      SELECT ${this.chapterColumns}
      FROM syllabus_chapter sc
      JOIN syllabus s ON sc.syllabus_id = s.syllabus_id
      LEFT JOIN m_class c ON s.class_id = c.class_id
      LEFT JOIN m_subject sub ON s.subject_id = sub.subject_id
      WHERE sc.del_status = false
    `;
    const params: any[] = [];
    if (syllabusId) {
      sql += ` AND sc.syllabus_id = $1`;
      params.push(syllabusId);
    }
    sql += ` ORDER BY sc.chapter_order ASC, sc.syllabus_chapter_id DESC`;

    return this.db.query(sql, params);
  }

  async getByIdAsync(id: number) {
    const sql = `
      SELECT ${this.chapterColumns}
      FROM syllabus_chapter sc
      JOIN syllabus s ON sc.syllabus_id = s.syllabus_id
      LEFT JOIN m_class c ON s.class_id = c.class_id
      LEFT JOIN m_subject sub ON s.subject_id = sub.subject_id
      WHERE sc.syllabus_chapter_id = $1 AND sc.del_status = false
    `;
    const rows = await this.db.query(sql, [id]);
    return rows[0] || null;
  }

  async createAsync(dto: CreateSyllabusChapterDto) {
    const sql = `
      INSERT INTO syllabus_chapter (
        syllabus_id, chapter_name, chapter_order, is_completed, 
        auth_add, add_on_dt, del_status
      )
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, false)
      RETURNING syllabus_chapter_id AS "syllabusChapterId"
    `;
    const result = await this.db.query(sql, [
      dto.syllabusId,
      dto.chapterName,
      dto.chapterOrder || 0,
      dto.isCompleted || false,
      'ADMIN'
    ]);
    return result[0]?.syllabusChapterId;
  }

  async updateAsync(id: number, dto: UpdateSyllabusChapterDto) {
    const sql = `
      UPDATE syllabus_chapter
      SET
        syllabus_id = COALESCE($1, syllabus_id),
        chapter_name = COALESCE($2, chapter_name),
        chapter_order = COALESCE($3, chapter_order),
        is_completed = COALESCE($4, is_completed),
        auth_lst_edt = $5,
        edit_on_dt = CURRENT_TIMESTAMP
      WHERE syllabus_chapter_id = $6 AND del_status = false
      RETURNING syllabus_chapter_id
    `;
    const result = await this.db.query(sql, [
      dto.syllabusId,
      dto.chapterName,
      dto.chapterOrder,
      dto.isCompleted,
      'ADMIN',
      id
    ]);
    return result.length > 0;
  }

  async deleteAsync(id: number) {
    const sql = `
      UPDATE syllabus_chapter
      SET del_status = true, auth_del = $1, del_on_dt = CURRENT_TIMESTAMP
      WHERE syllabus_chapter_id = $2
      RETURNING syllabus_chapter_id
    `;
    const result = await this.db.query(sql, ['ADMIN', id]);
    return result.length > 0;
  }
}
