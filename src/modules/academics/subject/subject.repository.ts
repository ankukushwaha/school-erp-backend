import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class SubjectRepository {
  constructor(private readonly db: DatabaseService) { }

  private get subjectColumns() {
    return `
      subject_id AS "subjectId",
      subject_name AS "subjectName",
      subject_code AS "subjectCode",
      is_optional AS "isOptional",
      subject_type AS "subjectType",
      category AS "category",
      description AS "description",
      min_marks AS "minMarks",
      max_marks AS "maxMarks",
      pass_marks AS "passMarks",
      auth_add AS "authAdd",
      auth_lst_edt AS "authLstEdt",
      auth_del AS "authDel",
      add_on_dt AS "addOnDt",
      edit_on_dt AS "editOnDt",
      del_on_dt AS "delOnDt",
      del_status AS "delStatus"
    `;
  }

  async getSubjects() {
    const query = `
      SELECT ${this.subjectColumns}
      FROM m_subject
      WHERE del_status = false
      ORDER BY subject_name
    `;
    return this.db.query(query);
  }

  async getSubjectById(id: number) {
    const query = `
      SELECT ${this.subjectColumns}
      FROM m_subject
      WHERE subject_id = $1
        AND del_status = false
    `;
    const result = await this.db.query(query, [id]);
    return result[0] || null;
  }

  async createSubject(subject: any) {
    const checkQuery = `
      SELECT COUNT(1) AS count
      FROM m_subject 
      WHERE subject_code = $1 
        AND del_status = false
    `;
    const check = await this.db.query(checkQuery, [subject.subjectCode]);
    if (parseInt(check[0].count, 10) > 0) {
      throw new BadRequestException('Subject code already exists');
    }

    const query = `
      INSERT INTO m_subject
      (
          subject_name,
          subject_code,
          is_optional,
          subject_type,
          category,
          description,
          min_marks,
          max_marks,
          pass_marks,
          auth_add,
          add_on_dt
      )
      VALUES
      (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
      )
      RETURNING subject_id AS "subjectId"
    `;
    const result = await this.db.query(query, [
      subject.subjectName,
      subject.subjectCode,
      subject.isOptional,
      subject.subjectType,
      subject.category,
      subject.description,
      subject.minMarks,
      subject.maxMarks,
      subject.passMarks,
      'ADMIN' // auth_add
    ]);

    return result[0]?.subjectId;
  }

  async updateSubject(subject: any) {
    const checkQuery = `
      SELECT COUNT(1) AS count
      FROM m_subject 
      WHERE subject_code = $1 
        AND subject_id <> $2
        AND del_status = false
    `;
    const check = await this.db.query(checkQuery, [subject.subjectCode, subject.subjectId]);
    if (parseInt(check[0].count, 10) > 0) {
      throw new BadRequestException('Subject code already exists');
    }

    const query = `
      UPDATE m_subject
      SET subject_name = $1,
          subject_code = $2,
          is_optional = $3,
          subject_type = $4,
          category = $5,
          description = $6,
          min_marks = $7,
          max_marks = $8,
          pass_marks = $9,
          auth_lst_edt = $10,
          edit_on_dt = NOW()
      WHERE subject_id = $11
      AND del_status = false
      RETURNING subject_id
    `;
    const result = await this.db.query(query, [
      subject.subjectName,
      subject.subjectCode,
      subject.isOptional,
      subject.subjectType,
      subject.category,
      subject.description,
      subject.minMarks,
      subject.maxMarks,
      subject.passMarks,
      'ADMIN',
      subject.subjectId,
    ]);

    return result.length > 0;
  }

  async deleteSubject(id: number) {
    const query = `
      UPDATE m_subject
      SET del_status = true,
          del_on_dt = NOW()
      WHERE subject_id = $1
      RETURNING subject_id
    `;
    const result = await this.db.query(query, [id]);
    return result.length > 0;
  }
}
