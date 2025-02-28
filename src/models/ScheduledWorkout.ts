import pool from "../config/database";

export interface ScheduledWorkout {
  id?: number;
  user_id: number;
  workout_plan_id: number;
  scheduled_date: Date;
  completed_date?: Date;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  comments?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface WorkoutLog {
  id?: number;
  scheduled_workout_id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
  completed_date?: Date;
  created_at?: Date;
}

export interface ScheduledWorkoutWithDetails extends ScheduledWorkout {
  workout_name: string;
  workout_description?: string;
}

export interface WorkoutLogWithDetails extends WorkoutLog {
  exercise_name: string;
  exercise_description?: string;
  category_name?: string;
  muscle_group_name?: string;
}

export interface CompletedWorkoutWithLogs extends ScheduledWorkoutWithDetails {
  logs: WorkoutLogWithDetails[];
}

export class ScheduledWorkoutModel {
  static async create(
    workoutData: ScheduledWorkout
  ): Promise<ScheduledWorkout> {
    const { user_id, workout_plan_id, scheduled_date, status, comments } =
      workoutData;
    const query = `
        INSERT INTO scheduled_workouts
        (user_id, workout_plan_id, scheduled_date, status, comments)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
       `;

    const values = [user_id, workout_plan_id, scheduled_date, status, comments];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async findById(
    id: number
  ): Promise<ScheduledWorkoutWithDetails | null> {
    const query = `
      SELECT sw.*, wp.name as workout_name, wp.description as workout_description
      FROM scheduled_workouts sw
      JOIN workout_plans wp ON sw.workout_plan_id = wp.id
      WHERE sw.id = $1
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0] || null;
  }

  static async findAllByUser(
    userId: number,
    status?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<ScheduledWorkoutWithDetails[]> {
    let query = `
      SELECT sw.*, wp.name as workout_name, wp.description as workout_description
      FROM scheduled_workouts sw
      JOIN workout_plans wp ON sw.workout_plan_id = wp.id
      WHERE sw.user_id = $1
    `;

    const queryParams: any[] = [userId];
    let paramIndex = 2;

    if (status) {
      query += ` AND sw.status = $${paramIndex}`;
      queryParams.push(status);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND sw.scheduled_date >= $${paramIndex}`;
      queryParams.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND sw.scheduled_date <= $${paramIndex}`;
      queryParams.push(endDate);
      paramIndex++;
    }

    query += " ORDER BY sw.scheduled_date";

    const result = await pool.query(query, queryParams);

    return result.rows;
  }

  static async update(
    id: number,
    workoutData: Partial<ScheduledWorkout>
  ): Promise<ScheduledWorkout | null> {
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
      UPDATE scheduled_workouts
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);

    return result.rows[0] || null;
  }

  static async delete(id: number) {
    const query = "DELETE FROM scheduled_workouts WHERE id = $1";
    const result = await pool.query(query, [id]);

    return result.rowCount !== null && result.rowCount > 0;
  }

  static async getUpcomingWorkouts(userId: number) {
    const query = `
      SELECT sw.*, wp.name as workout_name, wp.description as workout_description
      FROM scheduled_workouts sw
      JOIN workout_plans wp ON sw.workout_plan_id = wp.id
      WHERE sw.user_id = $1 AND sw.status = 'scheduled' AND sw.scheduled_date >= CURRENT_DATE
      ORDER BY sw.scheduled_date
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
  }

  static async markAsComplete(
    id: number,
    completedDate: Date,
    comments?: string
  ) {
    const query = `
      UPDATE scheduled_workouts
      SET status = 'completed', completed_date = $2, comments = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, completedDate, comments]);

    return result.rows[0] || null;
  }

  // Workout logs methods
  static async addWorkoutLog(logData: WorkoutLog): Promise<WorkoutLog> {
    const { scheduled_workout_id, exercise_id, sets, reps, weight, notes } =
      logData;

    const query = `
      INSERT INTO workout_logs 
      (scheduled_workout_id, exercise_id, sets, reps, weight, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      scheduled_workout_id,
      exercise_id,
      sets,
      reps,
      weight,
      notes,
    ];
    const result = await pool.query(query, values);

    return result.rows[0];
  }

  static async getWorkoutLogs(
    scheduledWorkoutId: number
  ): Promise<WorkoutLogWithDetails[]> {
    const query = `
      SELECT wl.*, e.name as exercise_name, e.description as exercise_description,
             ec.name as category_name, mg.name as muscle_group_name
      FROM workout_logs wl
      JOIN exercises e ON wl.exercise_id = e.id
      LEFT JOIN exercise_categories ec ON e.category_id = ec.id
      LEFT JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      WHERE wl.scheduled_workout_id = $1
      ORDER BY wl.created_at
    `;

    const result = await pool.query(query, [scheduledWorkoutId]);

    return result.rows;
  }

  static async getCompletedWorkoutWithLogs(
    workoutId: number
  ): Promise<CompletedWorkoutWithLogs | null> {
    // First, get the workout details
    const workoutQuery = `
      SELECT sw.*, wp.name as workout_name, wp.description as workout_description
      FROM scheduled_workouts sw
      JOIN workout_plans wp ON sw.workout_plan_id = wp.id
      WHERE sw.id = $1 AND sw.status = 'completed'
    `;

    const workoutResult = await pool.query(workoutQuery, [workoutId]);

    if (workoutResult.rows.length === 0) {
      return null;
    }

    const workout = workoutResult.rows[0];

    // Then, get all logs for this workout
    const logsQuery = `
      SELECT wl.*, e.name as exercise_name, e.description as exercise_description,
             ec.name as category_name, mg.name as muscle_group_name
      FROM workout_logs wl
      JOIN exercises e ON wl.exercise_id = e.id
      LEFT JOIN exercise_categories ec ON e.category_id = ec.id
      LEFT JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      WHERE wl.scheduled_workout_id = $1
      ORDER BY wl.created_at
    `;

    const logsResult = await pool.query(logsQuery, [workoutId]);

    return {
      ...workout,
      logs: logsResult.rows,
    };
  }

  static async getUserProgressByExercise(
    userId: number,
    exerciseId: number
  ): Promise<WorkoutLogWithDetails[]> {
    const query = `
      SELECT wl.*, sw.scheduled_date, sw.completed_date,
             e.name as exercise_name, e.description as exercise_description
      FROM workout_logs wl
      JOIN scheduled_workouts sw ON wl.scheduled_workout_id = sw.id
      JOIN exercises e ON wl.exercise_id = e.id
      WHERE sw.user_id = $1 AND wl.exercise_id = $2 AND sw.status = 'completed'
      ORDER BY sw.completed_date
    `;

    const result = await pool.query(query, [userId, exerciseId]);

    return result.rows;
  }
}
