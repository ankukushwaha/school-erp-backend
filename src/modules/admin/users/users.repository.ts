import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DatabaseService) {}

  async createAsync(user: any) {
    const sql = `
      INSERT INTO auth.tbl_user
      (user_name, user_password, master_id, role_id, is_admin,
       category, email, mobile_no, full_name, user_type,
       status, add_on_dt)
      VALUES
      ($1, $2, $3, $4, $5,
       $6, $7, $8, $9, $10,
       'ACTIVE', NOW())
      RETURNING user_id AS "userId";
    `;
    const rows = await this.db.query(sql, [
      user.userName,
      user.userPassword,
      user.masterId,
      user.roleId,
      user.isAdmin,
      user.category,
      user.email,
      user.mobileNo,
      user.fullName,
      user.userType
    ]);
    return rows[0]?.userId;
  }

  async getAllAsync() {
    const sql = `
      SELECT 
        user_id AS "userId",
        user_name AS "userName",
        master_id AS "masterId",
        role_id AS "roleId",
        is_admin AS "isAdmin",
        category AS "category",
        email AS "email",
        mobile_no AS "mobileNo",
        full_name AS "fullName",
        user_type AS "userType",
        status AS "status"
      FROM auth.tbl_user 
      WHERE del_status = false
    `;
    return this.db.query(sql);
  }

  async getByIdAsync(userId: number) {
    const sql = `
      SELECT 
        user_id AS "userId",
        user_name AS "userName",
        master_id AS "masterId",
        role_id AS "roleId",
        is_admin AS "isAdmin",
        category AS "category",
        email AS "email",
        mobile_no AS "mobileNo",
        full_name AS "fullName",
        user_type AS "userType",
        status AS "status"
      FROM auth.tbl_user
      WHERE user_id = $1 AND del_status = false
    `;
    const rows = await this.db.query(sql, [userId]);
    return rows[0] || null;
  }

  async updateAsync(user: any) {
    const sql = `
      UPDATE auth.tbl_user
      SET user_name = $1,
          master_id = $2,
          role_id = $3,
          is_admin = $4,
          category = $5,
          mobile_no = $6,
          full_name = $7,
          user_type = $8,
          status = $9,
          user_password = $10,
          edit_on_dt = NOW()
      WHERE user_id = $11
    `;
    const result = await this.db.query(sql, [
      user.userName,
      user.masterId,
      user.roleId,
      user.isAdmin,
      user.category,
      user.mobileNo,
      user.fullName,
      user.userType,
      user.status,
      user.userPassword,
      user.userId
    ]);
    return result.length > 0;
  }

  async deleteAsync(userId: number) {
    const sql = `
      UPDATE auth.tbl_user
      SET del_status = true,
          del_on_dt = NOW()
      WHERE user_id = $1
      RETURNING user_id
    `;
    const result = await this.db.query(sql, [userId]);
    return result.length > 0;
  }

  async getByEmailAsync(email: string) {
    const sql = `
      SELECT 
        user_id AS "userId",
        user_name AS "userName",
        user_password AS "userPassword",
        is_admin AS "isAdmin",
        email AS "email",
        status AS "status"
      FROM auth.tbl_user
      WHERE email = $1 AND del_status = false
    `;
    const rows = await this.db.query(sql, [email]);
    return rows[0] || null;
  }

  async updateLoginFailAsync(userId: number) {
    // Skipping full implementation, stub for LoginUserUseCase
    return true;
  }

  async updateLoginSuccessAsync(userId: number, ipAddress: string) {
    // Skipping full implementation, stub for LoginUserUseCase
    return true;
  }
}
