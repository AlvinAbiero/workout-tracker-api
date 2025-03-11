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
exports.createMuscleGroup = exports.getAllMuscleGroups = exports.createCategory = exports.getAllCategories = exports.getExercisesByMuscleGroup = exports.getExercisesByCategory = exports.deleteExercise = exports.updateExercise = exports.createExercise = exports.getExerciseById = exports.getAllExercises = void 0;
const exerciseService_1 = require("../services/exerciseService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.getAllExercises = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exercises = yield exerciseService_1.ExerciseService.getAllExercises();
    res.status(200).json({
        success: true,
        data: exercises,
    });
}));
exports.getExerciseById = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const exercise = yield exerciseService_1.ExerciseService.getExerciseById(id);
    res.status(200).json({
        success: true,
        data: exercise,
    });
}));
exports.createExercise = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category_id, muscle_group_id } = req.body;
    const exercise = yield exerciseService_1.ExerciseService.createExercise({
        name,
        description,
        category_id,
        muscle_group_id,
    });
    res.status(201).json({
        success: true,
        message: "Exercise created successfully",
        data: exercise,
    });
}));
exports.updateExercise = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { name, description, category_id, muscle_group_id } = req.body;
    const exercise = yield exerciseService_1.ExerciseService.updateExercise(id, {
        name,
        description,
        category_id,
        muscle_group_id,
    });
    res.status(200).json({
        success: true,
        message: "Exercise updated successfully",
        data: exercise,
    });
}));
exports.deleteExercise = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    yield exerciseService_1.ExerciseService.deleteExercise(id);
    res.status(200).json({
        succes: true,
        message: "Exercise deleted successfully",
    });
}));
exports.getExercisesByCategory = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = parseInt(req.params.categoryId);
    const exercises = yield exerciseService_1.ExerciseService.getExercisesByCategory(categoryId);
    res.status(200).json({
        success: true,
        data: exercises,
    });
}));
exports.getExercisesByMuscleGroup = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const muscleGroupId = parseInt(req.params.muscleGroupId);
    const exercises = yield exerciseService_1.ExerciseService.getExercisesByMuscleGroup(muscleGroupId);
    res.status(200).json({
        success: true,
        data: exercises,
    });
}));
exports.getAllCategories = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield exerciseService_1.ExerciseService.getAllCategories();
    res.status(200).json({
        success: true,
        data: categories,
    });
}));
exports.createCategory = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const category = yield exerciseService_1.ExerciseService.createCategory({
        name,
        description,
    });
    res.status(201).json({
        success: true,
        message: "Exercise category created successfully",
        data: category,
    });
}));
exports.getAllMuscleGroups = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const muscleGroups = yield exerciseService_1.ExerciseService.getAllMuscleGroups();
    res.status(200).json({
        success: true,
        data: muscleGroups,
    });
}));
exports.createMuscleGroup = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const muscleGroup = yield exerciseService_1.ExerciseService.createMuscleGroup({
        name,
        description,
    });
    res.status(201).json({
        success: true,
        message: "Muscle group created successfully",
        data: muscleGroup,
    });
}));
