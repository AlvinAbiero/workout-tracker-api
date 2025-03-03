import { Router } from 'express';
import * as exerciseController from '../controllers/exerciseController';
import { authenticate } from '../middleware/auth';

const router = Router();


// Exercise routes
router.get('/', authenticate, exerciseController.getAllExercises);
router.get('/:id', authenticate, exerciseController.getExerciseById);
router.post('/', authenticate, exerciseController.createExercise);
router.put('/:id', authenticate, exerciseController.updateExercise);
router.delete('/:id', authenticate, exerciseController.deleteExercise);

// Category-based routes
router.get('/category/:categoryId', authenticate, exerciseController.getExercisesByCategory);
router.get('/muscle-group/:muscleGroupId', authenticate, exerciseController.getExercisesByMuscleGroup);

// Category routes
router.get('/categories/all', authenticate, exerciseController.getAllCategories);
router.post('/categories', authenticate, exerciseController.createCategory);

// Muscle group routes
router.get('/muscle-groups/all', authenticate, exerciseController.getAllMuscleGroups);
router.post('/muscle-groups', authenticate, exerciseController.createMuscleGroup);

export default router;
