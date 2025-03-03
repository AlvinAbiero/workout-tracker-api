import { Router } from 'express';
import * as workoutController from '../controllers/workoutController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Workout plan routes
router.post('/plans', authenticate, workoutController.createWorkoutPlan);
router.get('/plans', authenticate, workoutController.getUserWorkoutPlans);
router.get('/plans/:id', authenticate, workoutController.getWorkoutPlanById);
router.put('/plans/:id', authenticate, workoutController.updateWorkoutPlan);
router.delete('/plans/:id', authenticate, workoutController.deleteWorkoutPlan);

// Workout exercise routes
router.post('/exercises', authenticate, workoutController.addExerciseToWorkout);
router.put('/exercises/:id', authenticate, workoutController.updateWorkoutExercise);
router.delete('/plans/:workoutPlanId/exercises/:id', authenticate, workoutController.removeExerciseFromWorkout);

// Scheduled workout routes
router.post('/schedule', authenticate, workoutController.scheduleWorkout);
router.get('/scheduled', authenticate, workoutController.getUserScheduledWorkouts);
router.get('/scheduled/:id', authenticate, workoutController.getScheduledWorkoutById);
router.put('/scheduled/:id', authenticate, workoutController.updateScheduledWorkout);
router.delete('/scheduled/:id', authenticate, workoutController.deleteScheduledWorkout);
router.get('/upcoming', authenticate, workoutController.getUpcomingWorkouts);
router.post('/scheduled/:id/complete', authenticate, workoutController.completeWorkout);

// Workout logs routes
router.post('/logs', authenticate, workoutController.logWorkoutExercise);
router.get('/scheduled/:scheduledWorkoutId/logs', authenticate, workoutController.getWorkoutLogs);
router.get('/completed/:workoutId', authenticate, workoutController.getCompletedWorkoutWithLogs);

export default router;

