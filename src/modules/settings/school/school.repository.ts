import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class SchoolRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllAsync() {
    const sql = `
      SELECT 
        school_id AS "schoolId",
        school_code AS "schoolCode",
        school_name AS "schoolName",
        principal_name AS "principalName",
        email AS "email",
        phone_number AS "phoneNumber",
        encode(logo, 'base64') AS "logo",
        logo_name AS "logoName",
        logo_type AS "logoType",
        address_line1 AS "addressLine1",
        address_line2 AS "addressLine2",
        city AS "city",
        state AS "state",
        country AS "country",
        postal_code AS "postalCode",
        is_active AS "isActive",
        auth_add AS "authAdd",
        auth_lst_edit AS "authLstEdt",
        auth_del AS "authDel",
        add_on_dt AS "addOnDt",
        edit_on_dt AS "editOnDt",
        del_on_dt AS "delOnDt",
        del_status AS "delStatus"
      FROM s_master.m_school
      WHERE del_status = false
      ORDER BY school_id
    `;
    return this.db.query(sql);
  }

  async getByIdAsync(id: number) {
    const sql = `
      SELECT 
        school_id AS "schoolId",
        school_code AS "schoolCode",
        school_name AS "schoolName",
        principal_name AS "principalName",
        email AS "email",
        phone_number AS "phoneNumber",
        encode(logo, 'base64') AS "logo",
        logo_name AS "logoName",
        logo_type AS "logoType",
        address_line1 AS "addressLine1",
        address_line2 AS "addressLine2",
        city AS "city",
        state AS "state",
        country AS "country",
        postal_code AS "postalCode"
      FROM s_master.m_school
      WHERE school_id = $1
        AND del_status = false
    `;
    const results = await this.db.query(sql, [id]);
    return results[0] || null;
  }

  async createAsync(school: any) {
    const sql = `
      INSERT INTO s_master.m_school (
        school_code, school_name, principal_name, email, phone_number,
        logo, logo_name, logo_type, address_line1, address_line2,
        city, state, country, postal_code, is_active, auth_add, add_on_dt
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, true, $15, NOW()
      ) RETURNING school_id AS "schoolId"
    `;

    const values = [
      school.schoolCode,
      school.schoolName,
      school.principalName,
      school.email,
      school.phoneNumber,
      school.logo, // Buffer
      school.logoName,
      school.logoType,
      school.addressLine1,
      school.addressLine2,
      school.city,
      school.state,
      school.country,
      school.postalCode,
      school.authAdd
    ];

    const results = await this.db.query(sql, values);
    return results[0] ? results[0].schoolId : null;
  }

  async updateAsync(id: number, school: any) {
    const sql = `
      UPDATE s_master.m_school
      SET
        school_code = $1,
        school_name = $2,
        principal_name = $3,
        email = $4,
        phone_number = $5,
        logo = COALESCE($6, logo),
        logo_name = COALESCE($7, logo_name),
        logo_type = COALESCE($8, logo_type),
        address_line1 = $9,
        address_line2 = $10,
        city = $11,
        state = $12,
        country = $13,
        postal_code = $14,
        auth_lst_edit = $15,
        edit_on_dt = NOW()
      WHERE school_id = $16
        AND del_status = false
      RETURNING school_id
    `;

    const values = [
      school.schoolCode ?? null,
      school.schoolName ?? null,
      school.principalName ?? null,
      school.email ?? null,
      school.phoneNumber ?? null,
      school.logo ?? null,
      school.logoName ?? null,
      school.logoType ?? null,
      school.addressLine1 ?? null,
      school.addressLine2 ?? null,
      school.city ?? null,
      school.state ?? null,
      school.country ?? null,
      school.postalCode ?? null,
      school.authLstEdt ?? null,
      id
    ];

    const results = await this.db.query(sql, values);
    return results.length > 0;
  }
}
