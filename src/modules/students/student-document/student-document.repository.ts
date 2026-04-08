import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class StudentDocumentRepository {
  constructor(private readonly db: DatabaseService) { }

  async createStudentDocument(entity: any) {
    const checkQuery = `
      SELECT COUNT(1) AS count
      FROM m_student_document
      WHERE (LOWER(document_code) = LOWER($1)
      OR LOWER(document_name) = LOWER($2))
      AND del_status = FALSE
    `;
    const checkResult = await this.db.query(checkQuery, [entity.documentCode, entity.documentName]);
    if (parseInt(checkResult[0].count, 10) > 0) {
      return { status: false, message: 'Duplicate record' };
    }

    const query = `
      INSERT INTO m_student_document
      (document_name, document_code, description, is_mandatory, is_active, auth_add)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING student_document_id AS "studentDocumentId"
    `;
    const rows = await this.db.query(query, [
      entity.documentName,
      entity.documentCode,
      entity.description,
      entity.isMandatory,
      entity.isActive,
      entity.authAdd || 'ADMIN'
    ]);

    return { status: true, data: rows[0]?.studentDocumentId };
  }

  async getAllStudentDocuments() {
    const query = `
      SELECT 
        student_document_id AS "studentDocumentId",
        document_name AS "documentName",
        document_code AS "documentCode",
        description AS "description",
        is_mandatory AS "isMandatory",
        is_active AS "isActive",
        auth_add AS "authAdd",
        auth_lst_edt AS "authLstEdt",
        auth_del AS "authDel",
        add_on_dt AS "addOnDt",
        edit_on_dt AS "editOnDt",
        del_on_dt AS "delOnDt",
        del_status AS "delStatus"
      FROM m_student_document
      WHERE del_status = FALSE
      ORDER BY document_name
    `;
    return this.db.query(query);
  }

  async getStudentDocumentById(id: number) {
    const query = `
      SELECT 
        student_document_id AS "studentDocumentId",
        document_name AS "documentName",
        document_code AS "documentCode",
        description AS "description",
        is_mandatory AS "isMandatory",
        is_active AS "isActive"
      FROM m_student_document
      WHERE student_document_id = $1
      AND del_status = FALSE
    `;
    const rows = await this.db.query(query, [id]);
    return rows[0] || null;
  }

  async updateStudentDocument(entity: any) {
    const query = `
      UPDATE m_student_document
      SET document_name = $1,
          document_code = $2,
          description = $3,
          is_mandatory = $4,
          is_active = $5,
          auth_lst_edt = $6,
          edit_on_dt = NOW()
      WHERE student_document_id = $7
      AND del_status = FALSE
      RETURNING student_document_id
    `;
    const result = await this.db.query(query, [
      entity.documentName,
      entity.documentCode,
      entity.description,
      entity.isMandatory,
      entity.isActive,
      entity.authAdd || 'ADMIN',
      entity.studentDocumentId
    ]);
    return result.length > 0;
  }

  async deleteStudentDocument(id: number) {
    const query = `
      UPDATE m_student_document
      SET del_status = TRUE,
          del_on_dt = NOW()
      WHERE student_document_id = $1
      RETURNING student_document_id
    `;
    const result = await this.db.query(query, [id]);
    return result.length > 0;
  }
}
