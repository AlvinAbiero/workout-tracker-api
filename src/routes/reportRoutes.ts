import { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Report routes
router.get('/summary', authenticate, reportController.getWorkoutSummary);
router.get('/exercise/:exerciseId/progress', authenticate, reportController.getExerciseProgress);
router.get('/monthly-stats', authenticate, reportController.getMonthlyWorkoutStats);

export default router;
