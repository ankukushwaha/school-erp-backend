import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class ClassSectionRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllWithNamesAsync() {
    const query = `
      SELECT
        cs.class_section_id AS "classSectionId",
        cs.class_id AS "classId",
        c.class_name AS "className",
        cs.section_id AS "sectionId",
        s.section_name AS "sectionName",
        cs.room_number AS "roomNumber",
        cs.floor AS "floor",
        cs.section_capacity AS "sectionCapacity",
        cs.class_teacher_id AS "classTeacherId",
        cs.class_section_code AS "classSectionCode"
      FROM s_master.m_class_section cs
      JOIN s_master.m_class c ON cs.class_id = c.class_id
      JOIN s_master.m_section_lookup s ON cs.section_id = s.section_id
      WHERE cs.del_status = false
    `;
    return this.db.query(query);
  }

  async getByIdWithNamesAsync(id: number) {
    const query = `
      SELECT
        cs.class_section_id AS "classSectionId",
        cs.class_id AS "classId",
        c.class_name AS "className",
        cs.section_id AS "sectionId",
        s.section_name AS "sectionName",
        cs.room_number AS "roomNumber",
        cs.floor AS "floor",
        cs.section_capacity AS "sectionCapacity",
        cs.class_teacher_id AS "classTeacherId",
        cs.class_section_code AS "classSectionCode"
      FROM s_master.m_class_section cs
      JOIN s_master.m_class c ON cs.class_id = c.class_id
      JOIN s_master.m_section_lookup s ON cs.section_id = s.section_id
      WHERE cs.class_section_id = $1
        AND cs.del_status = false
    `;
    const result = await this.db.query(query, [id]);
    return result[0] || null;
  }

  async getByClassAndSectionAsync(classId: number, sectionId: number) {
    const query = `
      SELECT
        class_section_id AS "classSectionId",
        class_id AS "classId",
        section_id AS "sectionId"
      FROM s_master.m_class_section
      WHERE class_id = $1
        AND section_id = $2
        AND del_status = false
    `;
    const result = await this.db.query(query, [classId, sectionId]);
    return result[0] || null;
  }

  async addAsync(entity: any) {
    const query = `
      INSERT INTO s_master.m_class_section
      (class_id, section_id, room_number, floor, section_capacity,
       class_teacher_id, class_section_code, auth_add, add_on_dt, del_status)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), false)
      RETURNING class_section_id AS "classSectionId"
    `;
    const result = await this.db.query(query, [
      entity.classId,
      entity.sectionId,
      entity.roomNumber,
      entity.floor,
      entity.sectionCapacity,
      entity.classTeacherId,
      entity.classSectionCode,
      'ADMIN', // authAdd defaulting to ADMIN
    ]);
    return result[0]?.classSectionId;
  }

  async updateAsync(entity: any) {
    const query = `
      UPDATE s_master.m_class_section
      SET
        class_id = $1,
        section_id = $2,
        room_number = $3,
        floor = $4,
        section_capacity = $5,
        class_teacher_id = $6,
        auth_lst_edt = $7,
        edit_on_dt = NOW()
      WHERE class_section_id = $8
        AND del_status = false
    `;
    await this.db.query(query, [
      entity.classId,
      entity.sectionId,
      entity.roomNumber,
      entity.floor,
      entity.sectionCapacity,
      entity.classTeacherId,
      'ADMIN',
      entity.classSectionId,
    ]);
  }

  async softDeleteAsync(id: number, deletedBy: string) {
    const query = `
      UPDATE s_master.m_class_section
      SET
        del_status = true,
        auth_del = $1,
        del_on_dt = NOW()
      WHERE class_section_id = $2
    `;
    await this.db.query(query, [deletedBy, id]);
  }
}
