import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class SectionLookupRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllAsync() {
    const query = `
      SELECT
        section_id AS "sectionId",
        section_name AS "sectionName",
        section_code AS "sectionCode",
        auth_add AS "authAdd",
        auth_lst_edt AS "authLstEdt",
        auth_del AS "authDel",
        add_on_dt AS "addOnDt",
        edit_on_dt AS "editOnDt",
        del_on_dt AS "delOnDt",
        del_status AS "delStatus"
      FROM s_master.m_section_lookup
      WHERE del_status = false
      ORDER BY section_id
    `;
    return this.db.query(query);
  }

  async getByIdAsync(id: number) {
    const query = `
      SELECT
        section_id AS "sectionId",
        section_name AS "sectionName",
        section_code AS "sectionCode",
        del_status AS "delStatus"
      FROM s_master.m_section_lookup
      WHERE section_id = $1
        AND del_status = false
    `;
    const rows = await this.db.query(query, [id]);
    return rows[0] || null;
  }

  async getByNameAsync(sectionName: string) {
    const query = `
      SELECT
        section_id AS "sectionId",
        section_name AS "sectionName",
        section_code AS "sectionCode",
        del_status AS "delStatus"
      FROM s_master.m_section_lookup
      WHERE LOWER(section_name) = LOWER($1)
        AND del_status = false
    `;
    const rows = await this.db.query(query, [sectionName]);
    return rows[0] || null;
  }

  async addAsync(entity: any) {
    const query = `
      INSERT INTO s_master.m_section_lookup
      (section_name, section_code, auth_add, add_on_dt, del_status)
      VALUES ($1, $2, $3, NOW(), false)
      RETURNING section_id AS "sectionId"
    `;
    const rows = await this.db.query(query, [
      entity.sectionName,
      entity.sectionCode,
      entity.authAdd || 'ADMIN'
    ]);
    return rows[0]?.sectionId;
  }

  async updateAsync(entity: any) {
    const query = `
      UPDATE s_master.m_section_lookup
      SET
        section_name = $1,
        section_code = $2,
        auth_lst_edt = $3,
        edit_on_dt = NOW()
      WHERE section_id = $4
        AND del_status = false
    `;
    const result = await this.db.query(query, [
      entity.sectionName,
      entity.sectionCode,
      entity.authLstEdt || 'ADMIN',
      entity.sectionId
    ]);
    return true; // Simple confirmation as per repo style
  }

  async softDeleteAsync(id: number, authDel: string) {
    const query = `
      UPDATE s_master.m_section_lookup
      SET
        del_status = true,
        auth_del = $1,
        del_on_dt = NOW()
      WHERE section_id = $2
        AND del_status = false
    `;
    await this.db.query(query, [authDel, id]);
    return true;
  }
}
