import pool from "../config/database";

export interface WorkoutPlan {
  id?: number;
  user_id: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface WorkoutExercise {
  id?: number;
  workout_plan_id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  order_index: number;
}

export interface WorkoutExerciseWithDetails extends WorkoutExercise {
  exercise_name: string;
  exercise_description?: string;
  category_name?: string;
  muscle_group_name?: string;
}

export interface WorkoutPlanWithExercises extends WorkoutPlan {
  exercises: WorkoutExerciseWithDetails[];
}

export class WorkoutPlanModel {
  static async create(workoutData: WorkoutPlan) {
    const { user_id, name, description } = workoutData;

    const query = `
        INSERT INTO workout_plans (user_id, name, description)
        VALUES ($1, $2, $3)
        RETURNING *
        `;

    const values = [user_id, name, description];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async findById(id: number) {
    // first, get the workout plan
    const workoutQuery = "SELECT * FROM workout_plans WHERE id = $1";
    const workoutResult = await pool.query(workoutQuery, [id]);

    if (workoutResult.rows.length === 0) {
      return null;
    }

    const workoutPlan = workoutResult.rows[0];

    // Then, get the exercises for this workout plan
    const exercisesQuery = `
         SELECT we.*, e.name as exercise_name, e.description as exercise_description,
             ec.name as category_name, mg.name as muscle_group_name
      FROM workout_exercises we
      JOIN exercises e ON we.exercise_id = e.id
      LEFT JOIN exercise_categories ec ON e.category_id = ec.id
      LEFT JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      WHERE we.workout_plan_id = $1
      ORDER BY we.order_index
        `;

    const exercisesResult = await pool.query(exercisesQuery, [id]);

    return {
      ...workoutPlan,
      exercises: exercisesResult.rows,
    };
  }

  static async findAllByUser(userId: number) {
    const query = `
        SELECT * FROM workout_plans
        WHERE user_id = $1
        ORDER BY created_at DESC
        `;

    const result = await pool.query(query, [userId]);

    return result.rows;
  }

  static async update(id: number, workoutData: Partial<WorkoutPlan>) {
    const fields = Object.keys(workoutData)
      .filter((key) => key !== "id" && key !== "user_id")
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    if (!fields) return null;

    const values = Object.values(workoutData).filter(
      (val, index) =>
        Object.keys(workoutData)[index] !== "id" &&
        Object.keys(workoutData)[index] !== "user_id"
    );

    const query = `
       UPDATE workout_plans
       SET ${fields}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *
       `;

    const result = await pool.query(query, [id, ...values]);

    return result.rows[0] || null;
  }

  static async delete(id: number) {
    const query = "DELETE FROM workout_plans WHERE id = $1";
    const result = await pool.query(query, [id]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  static async addExercise(exerciseData: WorkoutExercise) {
    const {
      workout_plan_id,
      exercise_id,
      sets,
      reps,
      weight,
      notes,
      order_index,
    } = exerciseData;

    const query = `
      INSERT INTO workout_exercises 
      (workout_plan_id, exercise_id, sets, reps, weight, notes, order_index)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      workout_plan_id,
      exercise_id,
      sets,
      reps,
      weight,
      notes,
      order_index,
    ];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async updateExercise(
    id: number,
    exerciseData: Partial<WorkoutExercise>
  ) {
    const fields = Object.keys(exerciseData)
      .filter((key) => key !== "id" && key !== "workout_plan_id")
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    if (!fields) return null;

    const values = Object.values(exerciseData).filter(
      (val, index) =>
        Object.keys(exerciseData)[index] !== "id" &&
        Object.keys(exerciseData)[index] !== "workout_plan_id"
    );

    const query = `
      UPDATE workout_exercises
      SET ${fields}
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);

    return result.rows[0] || null;
  }

  static async removeExercise(id: number) {
    const query = "DELETE FROM workout_exercises WHERE id = $1";
    const result = await pool.query(query, [id]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  static async getWorkoutExercises(workoutPlanId: number) {
    const query = `
      SELECT we.*, e.name as exercise_name, e.description as exercise_description,
             ec.name as category_name, mg.name as muscle_group_name
      FROM workout_exercises we
      JOIN exercises e ON we.exercise_id = e.id
      LEFT JOIN exercise_categories ec ON e.category_id = ec.id
      LEFT JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      WHERE we.workout_plan_id = $1
      ORDER BY we.order_index
    `;

    const result = await pool.query(query, [workoutPlanId]);

    return result.rows;
  }
}
