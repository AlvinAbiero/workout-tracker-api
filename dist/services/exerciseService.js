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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExerciseService = void 0;
const Exercise_1 = require("../models/Exercise");
class ExerciseService {
    static getAllExercises() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Exercise_1.ExerciseModel.findAll();
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getExerciseById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exercise = yield Exercise_1.ExerciseModel.findById(id);
                if (!exercise) {
                    throw new Error("Exercise not found");
                }
                return exercise;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static createExercise(exerciseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Exercise_1.ExerciseModel.create(exerciseData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateExercise(id, exerciseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedExercise = yield Exercise_1.ExerciseModel.update(id, exerciseData);
                if (!updatedExercise) {
                    throw new Error("Exercise not found");
                }
                return updatedExercise;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteExercise(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield Exercise_1.ExerciseModel.delete(id);
                if (!deleted) {
                    throw new Error("Exercise not found");
                }
                return true;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getExercisesByCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Exercise_1.ExerciseModel.findByCategory(categoryId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getExercisesByMuscleGroup(muscleGroupId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Exercise_1.ExerciseModel.findById(muscleGroupId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    //   Categories
    static getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Exercise_1.ExerciseModel.getAllCategories();
            }
            catch (error) {
                throw error;
            }
        });
    }
    static createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Exercise_1.ExerciseModel.createCategory(categoryData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Muscle Groups
    static getAllMuscleGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Exercise_1.ExerciseModel.getAllMuscleGroups();
            }
            catch (error) {
                throw error;
            }
        });
    }
    static createMuscleGroup(muscleGroupData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Exercise_1.ExerciseModel.create(muscleGroupData);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ExerciseService = ExerciseService;
