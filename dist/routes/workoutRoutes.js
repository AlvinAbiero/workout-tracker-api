"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workoutController = __importStar(require("../controllers/workoutController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Workout plan routes
router.post("/plans", auth_1.authenticate, workoutController.createWorkoutPlan);
router.get("/plans", auth_1.authenticate, workoutController.getUserWorkoutPlans);
router.get("/plans/:id", auth_1.authenticate, workoutController.getWorkoutPlanById);
router.put("/plans/:id", auth_1.authenticate, workoutController.updateWorkoutPlan);
router.delete("/plans/:id", auth_1.authenticate, workoutController.deleteWorkoutPlan);
// Workout exercise routes
router.post("/plans/:workoutPlanId/exercises", auth_1.authenticate, workoutController.addExerciseToWorkout);
router.put("/plans/:workoutPlanId/exercises/:id", auth_1.authenticate, workoutController.updateWorkoutExercise);
router.delete("/plans/:workoutPlanId/exercises/:id", auth_1.authenticate, workoutController.removeExerciseFromWorkout);
// Scheduled workout routes
router.post("/schedule", auth_1.authenticate, workoutController.scheduleWorkout);
router.get("/scheduled", auth_1.authenticate, workoutController.getUserScheduledWorkouts);
router.get("/scheduled/:id", auth_1.authenticate, workoutController.getScheduledWorkoutById);
router.put("/scheduled/:id", auth_1.authenticate, workoutController.updatedScheduledWorkout);
router.delete("/scheduled/:id", auth_1.authenticate, workoutController.deleteScheduledWorkout);
router.get("/upcoming", auth_1.authenticate, workoutController.getUpcomingWorkouts);
router.post("/scheduled/:id/complete", auth_1.authenticate, workoutController.completeWorkout);
// Workout logs routes
router.post("/logs", auth_1.authenticate, workoutController.logWorkoutExercise);
router.get("/scheduled/:scheduledWorkoutId/logs", auth_1.authenticate, workoutController.getWorkoutLogs);
router.get("/completed/:workoutId", auth_1.authenticate, workoutController.getCompletedWorkoutWithLogs);
exports.default = router;
