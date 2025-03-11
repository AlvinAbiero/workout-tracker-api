"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledWorkoutModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class ScheduledWorkoutModel {
    static create(workoutData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, workout_plan_id, scheduled_date, status, comments } = workoutData;
            const query = `
        INSERT INTO scheduled_workouts
        (user_id, workout_plan_id, scheduled_date, status, comments)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
       `;
            const values = [user_id, workout_plan_id, scheduled_date, status, comments];
            const result = yield database_1.default.query(query, values);
            return result.rows[0];
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT sw.*, wp.name as workout_name, wp.description as workout_description
      FROM scheduled_workouts sw
      JOIN workout_plans wp ON sw.workout_plan_id = wp.id
      WHERE sw.id = $1
    `;
            const result = yield database_1.default.query(query, [id]);
            return result.rows[0] || null;
        });
    }
    static findAllByUser(userId, status, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `
      SELECT sw.*, wp.name as workout_name, wp.description as workout_description
      FROM scheduled_workouts sw
      JOIN workout_plans wp ON sw.workout_plan_id = wp.id
      WHERE sw.user_id = $1
    `;
            const queryParams = [userId];
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
            const result = yield database_1.default.query(query, queryParams);
            return result.rows;
        });
    }
    static update(id, workoutData) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(workoutData)
                .filter((key) => key !== "id" && key !== "user_id")
                .map((key, index) => `${key} = $${index + 2}`)
                .join(", ");
            if (!fields)
                return null;
            const values = Object.values(workoutData).filter((val, index) => Object.keys(workoutData)[index] !== "id" &&
                Object.keys(workoutData)[index] !== "user_id");
            const query = `
      UPDATE scheduled_workouts
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
            const result = yield database_1.default.query(query, [id, ...values]);
            return result.rows[0] || null;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "DELETE FROM scheduled_workouts WHERE id = $1";
            const result = yield database_1.default.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        });
    }
    static getUpcomingWorkouts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT sw.*, wp.name as workout_name, wp.description as workout_description
      FROM scheduled_workouts sw
      JOIN workout_plans wp ON sw.workout_plan_id = wp.id
      WHERE sw.user_id = $1 AND sw.status = 'scheduled' AND sw.scheduled_date >= CURRENT_DATE
      ORDER BY sw.scheduled_date
    `;
            const result = yield database_1.default.query(query, [userId]);
            return result.rows;
        });
    }
    static markAsComplete(id, completedDate, comments) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      UPDATE scheduled_workouts
      SET status = 'completed', completed_date = $2, comments = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
            const result = yield database_1.default.query(query, [id, completedDate, comments]);
            return result.rows[0] || null;
        });
    }
    // Workout logs methods
    static addWorkoutLog(logData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { scheduled_workout_id, exercise_id, sets, reps, weight, notes } = logData;
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
            const result = yield database_1.default.query(query, values);
            return result.rows[0];
        });
    }
    static getWorkoutLogs(scheduledWorkoutId) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield database_1.default.query(query, [scheduledWorkoutId]);
            return result.rows;
        });
    }
    static getCompletedWorkoutWithLogs(workoutId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, get the workout details
            const workoutQuery = `
      SELECT sw.*, wp.name as workout_name, wp.description as workout_description
      FROM scheduled_workouts sw
      JOIN workout_plans wp ON sw.workout_plan_id = wp.id
      WHERE sw.id = $1 AND sw.status = 'completed'
    `;
            const workoutResult = yield database_1.default.query(workoutQuery, [workoutId]);
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
            const logsResult = yield database_1.default.query(logsQuery, [workoutId]);
            return Object.assign(Object.assign({}, workout), { logs: logsResult.rows });
        });
    }
    static getUserProgressByExercise(userId, exerciseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT wl.*, sw.scheduled_date, sw.completed_date,
             e.name as exercise_name, e.description as exercise_description
      FROM workout_logs wl
      JOIN scheduled_workouts sw ON wl.scheduled_workout_id = sw.id
      JOIN exercises e ON wl.exercise_id = e.id
      WHERE sw.user_id = $1 AND wl.exercise_id = $2 AND sw.status = 'completed'
      ORDER BY sw.completed_date
    `;
            const result = yield database_1.default.query(query, [userId, exerciseId]);
            return result.rows;
        });
    }
}
exports.ScheduledWorkoutModel = ScheduledWorkoutModel;
