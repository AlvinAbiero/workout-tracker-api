import pool from "../config/database";

export interface Exercise {
  id?: number;
  name: string;
  description?: string;
  category_id?: number;
  muscle_group_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface ExerciseCategory {
  id?: number;
  name: string;
  description?: string;
}

export interface MuscleGroup {
  id?: number;
  name: string;
  description?: string;
}

export interface ExerciseWithDetails extends Exercise {
  category_name?: string;
  muscle_group_name?: string;
}

export class ExerciseModel {
  static async create(exerciseData: Exercise) {
    const { name, description, category_id, muscle_group_id } = exerciseData;

    const query = `
      INSERT INTO exercises (name, description, category_id, muscle_group_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [name, description, category_id, muscle_group_id];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT e.*, ec.name as category_name, mg.name as muscle_group_name
      FROM exercises e
      LEFT JOIN exercise_categories ec ON e.category_id = ec.id
      LEFT JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      ORDER BY e.name
    `;

    const result = await pool.query(query);

    return result.rows;
  }
}
