import pool from "../config/database";
import { hashPassword } from "../utils/passwordUtils";

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async create(userData: User) {
    const { username, email, password, first_name, last_name } = userData;
    const hashedPassword = await hashPassword(password);

    const query = `
        INSERT INTO users (username, email , password, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, email, first_name, last_name, created_at, updated_at
        `;

    const values = [username, email, hashedPassword, first_name, last_name];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async findByEmail(email: string) {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    return result.rows[0] || null;
  }

  static async findById(id: number) {
    const query = `
        SELECT id, username, email, first_name, last_name, created_at, updated_at
        FROM users
        WHERE id = $1
        `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  static async findByusername(username: string) {
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);

    return result.rows[0] || null;
  }

  static async update(id: number, userData: Partial<User>) {
    const fields = Object.keys(userData)
      .filter((key) => key !== "id" && key !== "password")
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    if (!fields) return null;

    const values = Object.values(userData).filter(
      (val, index) =>
        Object.keys(userData)[index] !== "id" &&
        Object.keys(userData)[index] !== "password"
    );

    const query = `
      UPDATE users
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, username, email, first_name, last_name, created_at, updated_at
    `;

    const result = await pool.query(query, [id, ...values]);

    return result.rows[0] || null;
  }

  static async updatePassword(
    id: number,
    password: string
  ): Promise<UserResponse | null | Boolean> {
    const hashedPassword = await hashPassword(password);

    const query = `
        UPDATE users
      SET password = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      `;

    const result = await pool.query(query, [id, hashedPassword]);

    return result.rowCount !== null && result.rowCount > 0;
  }
}
