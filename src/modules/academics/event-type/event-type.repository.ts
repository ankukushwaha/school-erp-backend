import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class EventTypeRepository {
  constructor(private readonly db: DatabaseService) {}

  async createEventType(eventType: any) {
    const checkQuery = `
      SELECT COUNT(1) AS count
      FROM s_master.m_event_type
      WHERE LOWER(event_type_name) = LOWER($1)
        AND del_status = FALSE
    `;
    const checkResult = await this.db.query(checkQuery, [eventType.eventTypeName]);
    if (parseInt(checkResult[0].count, 10) > 0) {
      return -1; // Duplicate
    }

    const insertQuery = `
      INSERT INTO s_master.m_event_type (event_type_name, description)
      VALUES ($1, $2)
      RETURNING event_type_id AS "eventTypeId"
    `;
    const result = await this.db.query(insertQuery, [
      eventType.eventTypeName,
      eventType.description,
    ]);
    return result[0]?.eventTypeId;
  }

  async getAllEventTypes() {
    const query = `
      SELECT
        event_type_id AS "eventTypeId",
        event_type_name AS "eventTypeName",
        description AS "description",
        is_active AS "isActive"
      FROM s_master.m_event_type
      WHERE del_status = FALSE
      ORDER BY event_type_name
    `;
    return this.db.query(query);
  }

  async getEventTypeById(id: number) {
    const query = `
      SELECT
        event_type_id AS "eventTypeId",
        event_type_name AS "eventTypeName",
        description AS "description",
        is_active AS "isActive"
      FROM s_master.m_event_type
      WHERE event_type_id = $1
        AND del_status = FALSE
    `;
    const result = await this.db.query(query, [id]);
    return result[0] || null;
  }

  async updateEventType(eventType: any) {
    const checkQuery = `
      SELECT COUNT(1) AS count
      FROM s_master.m_event_type
      WHERE LOWER(event_type_name) = LOWER($1)
        AND event_type_id <> $2
        AND del_status = FALSE
    `;
    const checkResult = await this.db.query(checkQuery, [eventType.eventTypeName, eventType.eventTypeId]);
    if (parseInt(checkResult[0].count, 10) > 0) {
      return false;
    }

    const updateQuery = `
      UPDATE s_master.m_event_type
      SET
        event_type_name = $1,
        description = $2,
        is_active = $3,
        edit_on_dt = CURRENT_TIMESTAMP
      WHERE event_type_id = $4
        AND del_status = FALSE
      RETURNING event_type_id
    `;
    const result = await this.db.query(updateQuery, [
      eventType.eventTypeName,
      eventType.description,
      eventType.isActive,
      eventType.eventTypeId,
    ]);
    return result.length > 0;
  }

  async deleteEventType(id: number) {
    const query = `
      UPDATE s_master.m_event_type
      SET
        del_status = TRUE,
        del_on_dt = CURRENT_TIMESTAMP
      WHERE event_type_id = $1
        AND del_status = FALSE
      RETURNING event_type_id
    `;
    const result = await this.db.query(query, [id]);
    return result.length > 0;
  }
}
