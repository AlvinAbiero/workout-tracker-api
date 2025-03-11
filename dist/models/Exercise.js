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
exports.ExerciseModel = void 0;
const database_1 = __importDefault(require("../config/database"));
class ExerciseModel {
    static create(exerciseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, category_id, muscle_group_id } = exerciseData;
            const query = `
      INSERT INTO exercises (name, description, category_id, muscle_group_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
            const values = [name, description, category_id, muscle_group_id];
            const result = yield database_1.default.query(query, values);
            return result.rows[0];
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
      SELECT e.*, ec.name as category_name, mg.name as muscle_group_name
      FROM exercises e
      LEFT JOIN exercise_categories ec ON e.category_id = ec.id
      LEFT JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      ORDER BY e.name
    `;
            const result = yield database_1.default.query(query);
            return result.rows;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
       SELECT e.*, ec.name as category_name, mg.name as muscle_group_name
      FROM exercises e
      LEFT JOIN exercise_categories ec ON e.category_id = ec.id
      LEFT JOIN muscle_groups mg ON e.muscle_group_id = mg.id
      WHERE e.id = $1
    `;
            const result = yield database_1.default.query(query, [id]);
            return result.rows[0] || null;
        });
    }
    static findByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM exercises WHERE category_id = $1";
            const result = yield database_1.default.query(query, [categoryId]);
            return result.rows;
        });
    }
    static findByMuscleGroup(muscleGroupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM exercises WHERE muscle_group_id = $1";
            const result = yield database_1.default.query(query, [muscleGroupId]);
            return result.rows;
        });
    }
    static update(id, exerciseData) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = Object.keys(exerciseData)
                .filter((key) => key !== "id")
                .map((key, index) => `${key} = $${index + 2}`)
                .join(", ");
            if (!fields)
                return null;
            const values = Object.values(exerciseData).filter((val, index) => Object.keys(exerciseData)[index] !== "id");
            const query = `
      UPDATE exercises
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
            const query = "DELETE FROM exercises WHERE id = $1";
            const result = yield database_1.default.query(query, [id]);
            return result.rowCount !== null && result.rowCount > 0;
        });
    }
    // Category Methods
    static createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description } = categoryData;
            const query = `
    INSERT INTO exercise_categories (name, description)
    VALUES ($1, $2)
    RETURNING *
    `;
            const values = [name, description];
            const result = yield database_1.default.query(query, values);
            return result.rows;
        });
    }
    static getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM exercise_categories ORDER BY name";
            const result = yield database_1.default.query(query);
            return result.rows;
        });
    }
    static createMuscleGroup(muscleGroupData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description } = muscleGroupData;
            const query = `
    INSERT INTO muscle_groups (name, description)
    VALUES ($1, $2)
    RETURNING *
    `;
            const values = [name, description];
            const result = yield database_1.default.query(query, values);
            return result.rows[0];
        });
    }
    static getAllMuscleGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM muscle_groups ORDER BY name";
            const result = yield database_1.default.query(query);
            return result.rows;
        });
    }
}
exports.ExerciseModel = ExerciseModel;
