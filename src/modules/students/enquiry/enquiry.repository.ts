import { Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class EnquiryRepository {
  constructor(private readonly db: DatabaseService) { }

  private readonly enquiryColumns = `
    e.enquiry_id            AS "enquiryId",
    e.enquiry_no            AS "enquiryNo",
    e.enquiry_date          AS "enquiryDate",

    e.student_name          AS "studentName",
    e.student_mobile        AS "studentMobile",
    e.student_email         AS "studentEmail",

    e.parent_name           AS "parentName",
    e.parent_mobile         AS "parentMobile",
    e.parent_email          AS "parentEmail",

    e.previous_school       AS "previousSchool",
    e.occupation            AS "occupation",

    e.address               AS "address",
    e.city                  AS "city",

    e.district_id           AS "districtId",
    d.district_name         AS "districtName",

    e.state_id              AS "stateId",
    s.state_name            AS "stateName",

    e.pincode               AS "pincode",

    e.source                AS "source",
    e.priority              AS "priority",
    e.assigned_to           AS "assignedTo",
    e.followup_date         AS "followupDate",
    e.notes                 AS "notes",

    e.auth_add              AS "authAdd",
    e.auth_lst_edt          AS "authLstEdt",
    e.auth_del              AS "authDel",

    e.add_on_dt             AS "addOnDt",
    e.edit_on_dt            AS "editOnDt",
    e.del_on_dt             AS "delOnDt",
    e.del_status            AS "delStatus"
  `;

  async getAllAsync() {
    const query = `
      SELECT ${this.enquiryColumns}
      FROM s_core.enquiry e
      LEFT JOIN s_master.m_district d ON e.district_id = d.district_id
      LEFT JOIN s_master.m_state s ON e.state_id = s.state_id
      WHERE e.del_status = false
      ORDER BY e.enquiry_id DESC
    `;

    return this.db.query(query);
  }

  async getByIdAsync(id: number) {
    const query = `
      SELECT ${this.enquiryColumns}
      FROM s_core.enquiry e
      LEFT JOIN s_master.m_district d ON e.district_id = d.district_id
      LEFT JOIN s_master.m_state s ON e.state_id = s.state_id
      WHERE e.enquiry_id = $1
      AND e.del_status = false
    `;

    const rows = await this.db.query(query, [id]);
    return rows[0] || null;
  }

  async createAsync(dto: CreateEnquiryDto) {
    const insertQuery = `
      INSERT INTO s_core.enquiry
      (
          student_name, student_mobile, student_email,
          parent_name, parent_mobile, parent_email,
          previous_school, occupation,
          address, city, district_id, state_id, pincode,
          source, priority, assigned_to, followup_date, notes,
          auth_add
      )
      VALUES
      (
          $1,$2,$3,
          $4,$5,$6,
          $7,$8,
          $9,$10,$11,$12,$13,
          $14,$15,$16,$17,$18,
          $19
      )
      RETURNING enquiry_id
    `;

    const params = [
      dto.studentName, dto.studentMobile, dto.studentEmail,
      dto.parentName, dto.parentMobile, dto.parentEmail,
      dto.previousSchool, dto.occupation,
      dto.address, dto.city, dto.districtId, dto.stateId, dto.pincode,
      dto.source, dto.priority, dto.assignedTo, dto.followupDate, dto.notes,
      dto.authAdd
    ];

    const rows = await this.db.query(insertQuery, params);
    const enquiryId = rows[0]?.enquiry_id;

    if (enquiryId) {
      const year = new Date().getUTCFullYear();
      const enquiryNo = `ENQ-${year}-${enquiryId.toString().padStart(5, '0')}`;

      await this.db.query(
        'UPDATE s_core.enquiry SET enquiry_no = $1 WHERE enquiry_id = $2',
        [enquiryNo, enquiryId]
      );
    }

    return enquiryId;
  }

  async updateAsync(dto: UpdateEnquiryDto) {
    const query = `
      UPDATE s_core.enquiry SET
          student_name=$1,
          student_mobile=$2,
          student_email=$3,
          parent_name=$4,
          parent_mobile=$5,
          parent_email=$6,
          previous_school=$7,
          occupation=$8,
          address=$9,
          city=$10,
          district_id=$11,
          state_id=$12,
          pincode=$13,
          source=$14,
          priority=$15,
          assigned_to=$16,
          followup_date=$17,
          notes=$18,
          auth_lst_edt=$19,
          edit_on_dt=CURRENT_TIMESTAMP
      WHERE enquiry_id=$20
    `;

    const params = [
      dto.studentName, dto.studentMobile, dto.studentEmail,
      dto.parentName, dto.parentMobile, dto.parentEmail,
      dto.previousSchool, dto.occupation,
      dto.address, dto.city, dto.districtId, dto.stateId, dto.pincode,
      dto.source, dto.priority, dto.assignedTo, dto.followupDate, dto.notes,
      dto.authLstEdt, dto.enquiryId
    ];

    await this.db.query(query, params);
    return true;
  }

  async deleteAsync(id: number, authDel: string) {
    const query = `
      UPDATE s_core.enquiry
      SET del_status = true,
          auth_del = $1,
          del_on_dt = CURRENT_TIMESTAMP
      WHERE enquiry_id = $2
    `;

    await this.db.query(query, [authDel, id]);
    return true;
  }
}
