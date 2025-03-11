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
exports.WorkoutService = void 0;
const WorkoutPlan_1 = require("../models/WorkoutPlan");
const ScheduledWorkout_1 = require("../models/ScheduledWorkout");
class WorkoutService {
    // Workout Plans
    static createWorkoutPlan(workoutData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield WorkoutPlan_1.WorkoutPlanModel.create(workoutData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getWorkoutPlanById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workout = yield WorkoutPlan_1.WorkoutPlanModel.findById(id);
                if (!workout) {
                    throw new Error("Workout plan not found");
                }
                // Check if workout belongs to user
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to access this workout plan");
                }
                return workout;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getuserWorkoutPlans(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield WorkoutPlan_1.WorkoutPlanModel.findAllByUser(userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateWorkoutPlan(id, userId, workoutData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if workout exists and belongs to user
                const workout = yield WorkoutPlan_1.WorkoutPlanModel.findById(id);
                if (!workout) {
                    throw new Error("Workout plan not found");
                }
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to modify this workout plan");
                }
                // Update workout
                const updatedWorkout = yield WorkoutPlan_1.WorkoutPlanModel.update(id, workoutData);
                if (!updatedWorkout) {
                    throw new Error("Failed to update workout plan");
                }
                return updatedWorkout;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteWorkoutPlan(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if workout exists and belongs to user
                const workout = yield WorkoutPlan_1.WorkoutPlanModel.findById(id);
                if (!workout) {
                    throw new Error("Workout plan not found");
                }
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to delete this workout plan");
                }
                // Delete workout
                return yield WorkoutPlan_1.WorkoutPlanModel.delete(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    //  Workout Exercises
    static addExerciseToWorkout(userId, exerciseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if workout exists and belongs to user
                const workout = yield WorkoutPlan_1.WorkoutPlanModel.findById(exerciseData.workout_plan_id);
                if (!workout) {
                    throw new Error("Workout plan not found");
                }
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to modify this workout plan");
                }
                // Add exercise to workout
                return yield WorkoutPlan_1.WorkoutPlanModel.addExercise(exerciseData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateWorkoutExercise(id, userId, exerciseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get the workout exercise
                const exercises = yield WorkoutPlan_1.WorkoutPlanModel.getWorkoutExercises(exerciseData.workout_plan_id);
                const exercise = exercises.find((e) => e.id === id);
                if (!exercise) {
                    throw new Error("Workout exercise not found");
                }
                //    Check if workout belongs to user
                const workout = yield WorkoutPlan_1.WorkoutPlanModel.findById(exercise.workout_plan_id);
                if (!workout || workout.user_id !== userId) {
                    throw new Error("You are not authorized to modify this workout plan");
                }
                //   update exercise
                const updatedExercise = yield WorkoutPlan_1.WorkoutPlanModel.updateExercise(id, exerciseData);
                if (!updatedExercise) {
                    throw new Error("Failed to update workout exercise");
                }
                return updatedExercise;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static removeExerciseFromWorkout(id, userId, workoutPlanId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check if workout exists and belongs to user
                const workout = yield WorkoutPlan_1.WorkoutPlanModel.findById(workoutPlanId);
                if (!workout) {
                    throw new Error("Workout plan not found");
                }
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to modify this workout plan");
                }
                // Remove exercise
                return yield WorkoutPlan_1.WorkoutPlanModel.removeExercise(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    //   Scheduled workouts
    static scheduleWorkout(workoutData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if workout exists and belongs to user
                const workout = yield WorkoutPlan_1.WorkoutPlanModel.findById(workoutData.workout_plan_id);
                if (!workout) {
                    throw new Error("Workout plan not found");
                }
                if (workout.user_id !== workoutData.user_id) {
                    throw new Error("You are not authorized to schedule this workout plan");
                }
                // Scheduled workout
                return yield ScheduledWorkout_1.ScheduledWorkoutModel.create(workoutData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getScheduledWorkoutById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const workout = yield ScheduledWorkout_1.ScheduledWorkoutModel.findById(id);
                if (!workout) {
                    throw new Error("Scheduled workout not found");
                }
                // Check if workout belongs to user
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to access this scheduled workout");
                }
                return workout;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUserScheduledWorkouts(userId, status, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ScheduledWorkout_1.ScheduledWorkoutModel.findAllByUser(userId, status, startDate, endDate);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getUpcomingWorkouts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ScheduledWorkout_1.ScheduledWorkoutModel.getUpcomingWorkouts(userId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateScheduledWorkout(id, userId, workoutData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if scheduled workout exists and belongs to user
                const workout = yield ScheduledWorkout_1.ScheduledWorkoutModel.findById(id);
                if (!workout) {
                    throw new Error("Scheduled workout not found");
                }
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to modify this scheduled workout");
                }
                // Update scheduled workout
                const updatedWorkout = yield ScheduledWorkout_1.ScheduledWorkoutModel.update(id, workoutData);
                if (!updatedWorkout) {
                    throw new Error("Failed to update scheduled workout");
                }
                return updatedWorkout;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static completeWorkout(id, userId, completedDate, comments) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if scheduled workout exists and belongs to user
                const workout = yield ScheduledWorkout_1.ScheduledWorkoutModel.findById(id);
                if (!workout) {
                    throw new Error("Scheduled workout not found");
                }
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to modify this scheduled workout");
                }
                // Mark workout as complete
                const updatedWorkout = yield ScheduledWorkout_1.ScheduledWorkoutModel.markAsComplete(id, completedDate, comments);
                if (!updatedWorkout) {
                    throw new Error("Failed to complete workout");
                }
                return updatedWorkout;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static deleteScheduledWorkout(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if scheduled workout exists and belongs to user
                const workout = yield ScheduledWorkout_1.ScheduledWorkoutModel.findById(id);
                if (!workout) {
                    throw new Error("Scheduled workout not found");
                }
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to delete this scheduled workout");
                }
                // Delete scheduled workout
                return yield ScheduledWorkout_1.ScheduledWorkoutModel.delete(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    // Workout Logs
    static logWorkoutExercise(logData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if scheduled workout exists and belongs to user
                const workout = yield ScheduledWorkout_1.ScheduledWorkoutModel.findById(logData.scheduled_workout_id);
                if (!workout) {
                    throw new Error("Scheduled workout not found");
                }
                // Add workout log
                return yield ScheduledWorkout_1.ScheduledWorkoutModel.addWorkoutLog(logData);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getWorkoutLogs(scheduledWorkoutId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if scheduled workout exists and belongs to user
                const workout = yield ScheduledWorkout_1.ScheduledWorkoutModel.findById(scheduledWorkoutId);
                if (!workout) {
                    throw new Error("Scheduled workout not found");
                }
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to access these workout logs");
                }
                // Get workout logs
                return yield ScheduledWorkout_1.ScheduledWorkoutModel.getWorkoutLogs(scheduledWorkoutId);
            }
            catch (error) {
                throw error;
            }
        });
    }
    static getCompletedWorkoutWithLogs(workoutId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get completed workout with logs
                const workout = yield ScheduledWorkout_1.ScheduledWorkoutModel.getCompletedWorkoutWithLogs(workoutId);
                if (!workout) {
                    throw new Error("Completed workout not found");
                }
                // Check if workout belongs to user
                if (workout.user_id !== userId) {
                    throw new Error("You are not authorized to access this workout");
                }
                return workout;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.WorkoutService = WorkoutService;
