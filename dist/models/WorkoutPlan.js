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
exports.WorkoutPlanModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class WorkoutPlanModel {
    static create(workoutData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id, name, description } = workoutData;
            const query = `
        INSERT INTO workout_plans (user_id, name, description)
        VALUES ($1, $2, $3)
        RETURNING *
        `;
            const values = [user_id, name, description];
            const result = yield database_1.default.query(query, values);
            return result.rows[0];
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // first, get the workout plan
            const workoutQuery = "SELECT * FROM workout_plans WHERE id = $1";
            const workoutResult = yield database_1.default.query(workoutQuery, [id]);
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
            const exercisesResult = yield database_1.default.query(exercisesQuery, [id]);
            return Object.assign(Object.assign({}, workoutPlan), { exercises: exercisesResult.rows });
        });
    }
    static findAllByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
        SELECT * FROM workout_plans
        WHERE user_id = $1
        ORDER BY created_at DESC
        `;
            const result = yield database_1.default.query(query, [userId]);
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
       UPDATE workout_plans
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
            const query = "DELETE FROM workout_plans WHERE id = $1";
            const result = yield database_1.default.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        });
    }
    static addExercise(exerciseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { workout_plan_id, exercise_id, sets, reps, weight, notes, order_index, } = exerciseData;
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
            const result = yield database_1.default.query(query, values);
            return result.rows[0];
        });
    }
    static updateExercise(id, exerciseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(exerciseData)
                .filter((key) => key !== "id" && key !== "workout_plan_id")
                .map((key, index) => `${key} = $${index + 2}`)
                .join(", ");
            if (!fields)
                return null;
            const values = Object.values(exerciseData).filter((val, index) => Object.keys(exerciseData)[index] !== "id" &&
                Object.keys(exerciseData)[index] !== "workout_plan_id");
            const query = `
      UPDATE workout_exercises
      SET ${fields}
      WHERE id = $1
      RETURNING *
    `;
            const result = yield database_1.default.query(query, [id, ...values]);
            return result.rows[0] || null;
        });
    }
    static removeExercise(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "DELETE FROM workout_exercises WHERE id = $1";
            const result = yield database_1.default.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        });
    }
    static getWorkoutExercises(workoutPlanId) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield database_1.default.query(query, [workoutPlanId]);
            return result.rows;
        });
    }
}
exports.WorkoutPlanModel = WorkoutPlanModel;
