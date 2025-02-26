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

  static async findById(id: number) {
    const query = `
       SELECT e.*, ec.name as category_name, mg.name as muscle_group_name
      FROM exercises e
      LEFT JOIN exercise_categories ec ON e.category_id = ec.id
      LEFT JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      WHERE e.id = $1
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  static async findByCategory(categoryId: number) {
    const query = "SELECT * FROM exercises WHERE category_id = $1";
    const result = await pool.query(query, [categoryId]);

    return result.rows;
  }

  static async findByMuscleGroup(muscleGroupId: number) {
    const query = "SELECT * FROM exercises WHERE muscle_group_id = $1";
    const result = await pool.query(query, [muscleGroupId]);

    return result.rows;
  }

  static async update(id: number, exerciseData: Partial<Exercise>) {
    const fields = Object.keys(exerciseData)
      .filter((key) => key !== "id")
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    if (!fields) return null;

    const values = Object.values(exerciseData).filter(
      (val, index) => Object.keys(exerciseData)[index] !== "id"
    );

    const query = `
      UPDATE exercises
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `;

    const result = await pool.query(query, [id, ...values]);

    return result.rows[0] || null;
  }

  static async delete(id: number) {
    const query = "DELETE FROM exercises WHERE id = $1";
    const result = await pool.query(query, [id]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  // Category Methods

  static async createCategory(categoryData: ExerciseCategory) {
    const { name, description } = categoryData;

    const query = `
    INSERT INTO exercise_categories (name, description)
    VALUES ($1, $2)
    RETURNING *
    `;

    const values = [name, description];
    const result = await pool.query(query, values);

    return result.rows;
  }

  static async getAllCategories() {
    const query = "SELECT * FROM exercise_categories ORDER BY name";
    const result = await pool.query(query);

    return result.rows;
  }

  static async createMuscleGroup(muscleGroupData: MuscleGroup) {
    const { name, description } = muscleGroupData;

    const query = `
    INSERT INTO muscle_groups (name, description)
    VALUES ($1, $2)
    RETURNING *
    `;

    const values = [name, description];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async getAllMuscleGroups() {
    const query = "SELECT * FROM muscle_groups ORDER BY name";
    const result = await pool.query(query);

    return result.rows;
  }
}
