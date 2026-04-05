import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class AcademicYearRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllWithTermsAsync() {
    const sql = `
      SELECT 
        ay.academic_year_id AS "academicYearId",
        ay.academic_year AS "academicYearName",
        ay.start_date AS "startDate",
        ay.end_date AS "endDate",
        ay.is_active AS "isActive",
        
        t.term_id AS "termId",
        t.term_name AS "termName",
        t.start_date AS "termStartDate",
        t.end_date AS "termEndDate",
        t.working_days AS "workingDays"
      FROM s_master.m_academic_year ay
      LEFT JOIN s_master.m_academic_year_term t
          ON ay.academic_year_id = t.academic_year_id
      WHERE ay.del_status = false
      ORDER BY ay.academic_year_id DESC
    `;
    const rows = await this.db.query(sql);

    const lookup = new Map();
    for (const row of rows) {
      if (!lookup.has(row.academicYearId)) {
        lookup.set(row.academicYearId, {
          academicYearId: row.academicYearId,
          academicYearName: row.academicYearName,
          startDate: row.startDate,
          endDate: row.endDate,
          isActive: row.isActive,
          terms: [] as any[],
        });
      }
      if (row.termId) {
        lookup.get(row.academicYearId).terms.push({
          termId: row.termId,
          termName: row.termName,
          startDate: row.termStartDate,
          endDate: row.termEndDate,
          workingDays: row.workingDays,
        });
      }
    }
    return Array.from(lookup.values());
  }

  async getAcademicYearWithTerms(id: number) {
    const sql = `
      SELECT 
        ay.academic_year_id AS "academicYearId",
        ay.academic_year AS "academicYearName",
        ay.start_date AS "startDate",
        ay.end_date AS "endDate",
        ay.is_active AS "isActive",
        
        t.term_id AS "termId",
        t.term_name AS "termName",
        t.start_date AS "termStartDate",
        t.end_date AS "termEndDate",
        t.working_days AS "workingDays"
      FROM s_master.m_academic_year ay
      LEFT JOIN s_master.m_academic_year_term t
          ON ay.academic_year_id = t.academic_year_id
      WHERE ay.academic_year_id = $1
        AND ay.del_status = false
    `;
    const rows = await this.db.query(sql, [id]);

    if (rows.length === 0) return null;

    const academicYear = {
      academicYearId: rows[0].academicYearId,
      academicYearName: rows[0].academicYearName,
      startDate: rows[0].startDate,
      endDate: rows[0].endDate,
      isActive: rows[0].isActive,
      terms: [] as any[],
    };

    for (const row of rows) {
      if (row.termId) {
        academicYear.terms.push({
          termId: row.termId,
          termName: row.termName,
          startDate: row.termStartDate,
          endDate: row.termEndDate,
          workingDays: row.workingDays,
        });
      }
    }
    return academicYear;
  }

  async existsAsync(academicYearName: string) {
    const sql = `
      SELECT COUNT(1) AS count
      FROM s_master.m_academic_year
      WHERE academic_year = $1
        AND del_status = false
    `;
    const result = await this.db.query(sql, [academicYearName]);
    return parseInt(result[0].count, 10) > 0;
  }

  async createAsync(entity: any) {
    const sql = `
      INSERT INTO s_master.m_academic_year (academic_year, start_date, end_date, is_active, add_on_dt)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING academic_year_id AS "academicYearId";
    `;
    const result = await this.db.query(sql, [
      entity.academicYearName,
      entity.startDate,
      entity.endDate,
      entity.isActive,
    ]);
    return result[0]?.academicYearId;
  }

  async insertTermsAsync(terms: any[]) {
    // Basic iterative insert for terms
    const sql = `
      INSERT INTO s_master.m_academic_year_term (academic_year_id, term_name, start_date, end_date, working_days, add_on_dt)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;
    for (const term of terms) {
      await this.db.query(sql, [
        term.academicYearId,
        term.termName,
        term.startDate,
        term.endDate,
        term.workingDays,
      ]);
    }
  }

  async updateAsync(entity: any) {
    const sql = `
      UPDATE s_master.m_academic_year
      SET academic_year = $1,
          start_date = $2,
          end_date = $3,
          is_active = $4,
          edit_on_dt = NOW()
      WHERE academic_year_id = $5
      RETURNING academic_year_id
    `;
    const result = await this.db.query(sql, [
      entity.academicYearName,
      entity.startDate,
      entity.endDate,
      entity.isActive,
      entity.academicYearId,
    ]);
    return result.length > 0;
  }

  async deleteAsync(id: number) {
    const sql = `
      UPDATE s_master.m_academic_year
      SET del_status = true,
          del_on_dt = NOW()
      WHERE academic_year_id = $1
      RETURNING academic_year_id
    `;
    const result = await this.db.query(sql, [id]);
    return result.length > 0;
  }

  async insertTermAsync(term: any) {
    const sql = `
      INSERT INTO s_master.m_academic_year_term (academic_year_id, term_name, start_date, end_date, working_days, add_on_dt)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `;
    await this.db.query(sql, [
      term.academicYearId,
      term.termName,
      term.startDate,
      term.endDate,
      term.workingDays,
    ]);
  }

  async updateTermAsync(term: any) {
    const sql = `
      UPDATE s_master.m_academic_year_term
      SET term_name = $1,
          start_date = $2,
          end_date = $3,
          working_days = $4,
          edit_on_dt = NOW()
      WHERE term_id = $5
    `;
    await this.db.query(sql, [
      term.termName,
      term.startDate,
      term.endDate,
      term.workingDays,
      term.termId,
    ]);
  }
}
