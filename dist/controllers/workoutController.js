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
exports.getCompletedWorkoutWithLogs = exports.getWorkoutLogs = exports.logWorkoutExercise = exports.deleteScheduledWorkout = exports.completeWorkout = exports.updatedScheduledWorkout = exports.getUpcomingWorkouts = exports.getUserScheduledWorkouts = exports.getScheduledWorkoutById = exports.scheduleWorkout = exports.removeExerciseFromWorkout = exports.updateWorkoutExercise = exports.addExerciseToWorkout = exports.deleteWorkoutPlan = exports.updateWorkoutPlan = exports.getUserWorkoutPlans = exports.getWorkoutPlanById = exports.createWorkoutPlan = void 0;
const workoutService_1 = require("../services/workoutService");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createWorkoutPlan = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { name, description } = req.body;
    const workoutPlan = yield workoutService_1.WorkoutService.createWorkoutPlan({
        user_id: userId,
        name,
        description,
    });
    res.status(201).json({
        success: true,
        message: "Workout plan created successfully",
        data: workoutPlan,
    });
}));
exports.getWorkoutPlanById = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    const workoutPlan = yield workoutService_1.WorkoutService.getWorkoutPlanById(id, userId);
    res.status(200).json({
        success: true,
        data: workoutPlan,
    });
}));
exports.getUserWorkoutPlans = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const workoutPlans = yield workoutService_1.WorkoutService.getuserWorkoutPlans(userId);
    res.status(200).json({
        success: true,
        data: workoutPlans,
    });
}));
exports.updateWorkoutPlan = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const workoutPlan = yield workoutService_1.WorkoutService.updateWorkoutPlan(id, userId, {
        name,
        description,
    });
    res.status(200).json({
        success: true,
        message: "Workout plan updated successfully",
        data: workoutPlan,
    });
}));
exports.deleteWorkoutPlan = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const userId = req.user.id;
    yield workoutService_1.WorkoutService.deleteWorkoutPlan(id, userId);
    res.status(200).json({
        success: true,
        message: "Workout plan deleted successfully",
    });
}));
exports.addExerciseToWorkout = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const exerciseData = req.body;
    const exercise = yield workoutService_1.WorkoutService.addExerciseToWorkout(userId, exerciseData);
    res.status(201).json({
        success: true,
        message: "Exercise added to workout plan successfully",
        data: exercise,
    });
}));
exports.updateWorkoutExercise = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const exerciseData = req.body;
    const updatedExercise = yield workoutService_1.WorkoutService.updateWorkoutExercise(id, userId, exerciseData);
    res.status(200).json({
        success: true,
        message: "Workout exercise update successfully",
        data: updatedExercise,
    });
}));
exports.removeExerciseFromWorkout = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const workoutPlanId = parseInt(req.params.workoutPlanId);
    yield workoutService_1.WorkoutService.removeExerciseFromWorkout(id, userId, workoutPlanId);
    res.status(200).json({
        success: true,
        message: "Exercise removed from workout plan successfully",
    });
}));
exports.scheduleWorkout = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { workout_plan_id, scheduled_date, comments } = req.body;
    const scheduledWorkout = yield workoutService_1.WorkoutService.scheduleWorkout({
        user_id: userId,
        workout_plan_id,
        scheduled_date: new Date(scheduled_date),
        status: "scheduled",
    });
    res.status(201).json({
        success: true,
        message: "Workout scheduled successfully",
        data: scheduledWorkout,
    });
}));
exports.getScheduledWorkoutById = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const scheduledWorkout = yield workoutService_1.WorkoutService.getScheduledWorkoutById(id, userId);
    res.status(200).json({
        success: true,
        data: scheduledWorkout,
    });
}));
exports.getUserScheduledWorkouts = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { status, startDate, endDate } = req.query;
    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;
    const scheduledWorkouts = yield workoutService_1.WorkoutService.getUserScheduledWorkouts(userId, status, startDateObj, endDateObj);
    res.status(200).json({
        success: true,
        data: scheduledWorkouts,
    });
}));
exports.getUpcomingWorkouts = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const upcomingWorkouts = yield workoutService_1.WorkoutService.getUpcomingWorkouts(userId);
    res.status(200).json({
        success: true,
        data: upcomingWorkouts,
    });
}));
exports.updatedScheduledWorkout = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const { scheduled_date, status } = req.body;
    const scheduledWorkout = yield workoutService_1.WorkoutService.updateScheduledWorkout(id, userId, {
        scheduled_date: scheduled_date ? new Date(scheduled_date) : undefined,
        status,
    });
    res.status(200).json({
        success: true,
        message: "Scheduled workout updated successfully",
        data: scheduledWorkout,
    });
}));
exports.completeWorkout = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const { completed_date, comments } = req.body;
    const completedWorkout = yield workoutService_1.WorkoutService.completeWorkout(id, userId, new Date(completed_date || new Date()), comments);
    res.status(200).json({
        success: true,
        message: "Workout completed successfully",
        data: completedWorkout,
    });
}));
exports.deleteScheduledWorkout = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    yield workoutService_1.WorkoutService.deleteScheduledWorkout(id, userId);
    res.status(200).json({
        success: true,
        message: "Scheduled workout deleted successfully",
    });
}));
// Workout Log Controllers
exports.logWorkoutExercise = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { scheduled_workout_id, exercise_id, sets, reps, weight, notes } = req.body;
    const workoutLog = yield workoutService_1.WorkoutService.logWorkoutExercise({
        scheduled_workout_id,
        exercise_id,
        sets,
        reps,
        weight,
        notes,
    });
    res.status(201).json({
        success: true,
        message: "Exercise logged successfully",
        data: workoutLog,
    });
}));
exports.getWorkoutLogs = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const scheduledWorkoutId = parseInt(req.params.scheduledWorkoutId);
    const workoutLogs = yield workoutService_1.WorkoutService.getWorkoutLogs(scheduledWorkoutId, userId);
    res.status(200).json({
        success: true,
        data: workoutLogs,
    });
}));
exports.getCompletedWorkoutWithLogs = (0, asyncHandler_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const workoutId = parseInt(req.params.workoutId);
    const workoutWithLogs = yield workoutService_1.WorkoutService.getCompletedWorkoutWithLogs(workoutId, userId);
    res.status(200).json({
        success: true,
        data: workoutWithLogs,
    });
}));
