import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class ClassRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllAsync() {
    const sql = `
      SELECT
          class_id AS "classId",
          class_name AS "className",
          class_code AS "classCode",
          class_order AS "classOrder",
          maximum_capacity AS "maximumCapacity",
          description AS "description",
          COALESCE(del_status, false) AS "delStatus"
      FROM s_master.m_class
      WHERE COALESCE(del_status, false) = false
      ORDER BY class_order
    `;
    return this.db.query(sql);
  }

  async getByIdAsync(id: number) {
    const sql = `
      SELECT
          class_id AS "classId",
          class_name AS "className",
          class_code AS "classCode",
          class_order AS "classOrder",
          maximum_capacity AS "maximumCapacity",
          description AS "description",
          COALESCE(del_status, false) AS "delStatus"
      FROM s_master.m_class
      WHERE class_id = $1
        AND COALESCE(del_status, false) = false
    `;
    const result = await this.db.query(sql, [id]);
    return result[0] || null;
  }

  async createAsync(entity: any) {
    const sql = `
      INSERT INTO s_master.m_class
      (class_name, class_code, class_order, maximum_capacity, description, add_on_dt)
      VALUES
      ($1, $2, $3, $4, $5, NOW())
      RETURNING class_id AS "classId"
    `;
    const result = await this.db.query(sql, [
      entity.className,
      entity.classCode,
      entity.classOrder,
      entity.maximumCapacity,
      entity.description,
    ]);
    return result[0]?.classId;
  }

  async updateAsync(entity: any) {
    const sql = `
      UPDATE s_master.m_class
      SET
          class_name = $1,
          class_code = $2,
          class_order = $3,
          maximum_capacity = $4,
          description = $5,
          edit_on_dt = NOW()
      WHERE class_id = $6
        AND COALESCE(del_status, false) = false
      RETURNING class_id
    `;
    const result = await this.db.query(sql, [
      entity.className,
      entity.classCode,
      entity.classOrder,
      entity.maximumCapacity,
      entity.description,
      entity.classId,
    ]);
    return result.length > 0;
  }

  async deleteAsync(id: number) {
    const sql = `
      UPDATE s_master.m_class
      SET del_status = true,
          del_on_dt = NOW()
      WHERE class_id = $1
      RETURNING class_id
    `;
    const result = await this.db.query(sql, [id]);
    return result.length > 0;
  }
}
