import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { CreateSyllabusTopicDto, UpdateSyllabusTopicDto } from './dto/syllabus-topic.dto';

@Injectable()
export class SyllabusTopicRepository {
  constructor(private readonly db: DatabaseService) { }

  private get topicColumns() {
    return `
      st.topic_id AS "topicId",
      st.syllabus_chapter_id AS "syllabusChapterId",
      st.topic_name AS "topicName",
      st.topic_content AS "topicContent",
      st.is_completed AS "isCompleted",
      st.completed_date AS "completedDate",
      sc.chapter_name AS "chapterName"
    `;
  }

  async getAllAsync(syllabusChapterId?: number) {
    let sql = `
      SELECT ${this.topicColumns}
      FROM syllabus_topic st
      JOIN syllabus_chapter sc ON st.syllabus_chapter_id = sc.syllabus_chapter_id
      WHERE st.del_status = false
    `;
    const params: any[] = [];
    if (syllabusChapterId) {
      sql += ` AND st.syllabus_chapter_id = $1`;
      params.push(syllabusChapterId);
    }
    sql += ` ORDER BY st.topic_id ASC`;

    return this.db.query(sql, params);
  }

  async getByIdAsync(id: number) {
    const sql = `
      SELECT ${this.topicColumns}
      FROM syllabus_topic st
      JOIN syllabus_chapter sc ON st.syllabus_chapter_id = sc.syllabus_chapter_id
      WHERE st.topic_id = $1 AND st.del_status = false
    `;
    const rows = await this.db.query(sql, [id]);
    return rows[0] || null;
  }

  async createAsync(dto: CreateSyllabusTopicDto) {
    const sql = `
      INSERT INTO syllabus_topic (
        syllabus_chapter_id, topic_name, topic_content, is_completed, 
        completed_date, auth_add, add_on_dt, del_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, false)
      RETURNING topic_id AS "topicId"
    `;
    const result = await this.db.query(sql, [
      dto.syllabusChapterId,
      dto.topicName,
      dto.topicContent,
      dto.isCompleted || false,
      dto.isCompleted ? new Date() : null,
      'ADMIN'
    ]);
    return result[0]?.topicId;
  }

  async updateAsync(id: number, dto: UpdateSyllabusTopicDto) {
    const sql = `
      UPDATE syllabus_topic
      SET
        syllabus_chapter_id = COALESCE($1, syllabus_chapter_id),
        topic_name = COALESCE($2, topic_name),
        topic_content = COALESCE($3, topic_content),
        is_completed = COALESCE($4, is_completed),
        completed_date = CASE 
          WHEN $4 = true AND is_completed = false THEN CURRENT_TIMESTAMP
          WHEN $4 = false THEN NULL
          ELSE completed_date
        END,
        auth_lst_edt = $5,
        edit_on_dt = CURRENT_TIMESTAMP
      WHERE topic_id = $6 AND del_status = false
      RETURNING topic_id
    `;
    const result = await this.db.query(sql, [
      dto.syllabusChapterId,
      dto.topicName,
      dto.topicContent,
      dto.isCompleted,
      'ADMIN',
      id
    ]);
    return result.length > 0;
  }

  async deleteAsync(id: number) {
    const sql = `
      UPDATE syllabus_topic
      SET del_status = true, auth_del = $1, del_on_dt = CURRENT_TIMESTAMP
      WHERE topic_id = $2
      RETURNING topic_id
    `;
    const result = await this.db.query(sql, ['ADMIN', id]);
    return result.length > 0;
  }
}
