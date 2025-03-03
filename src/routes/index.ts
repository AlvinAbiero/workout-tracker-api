import { Router } from 'express';
import authRoutes from './authRoutes';
import exerciseRoutes from './exerciseRoutes';
import workoutRoutes from './workoutRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/workouts', workoutRoutes);
router.use('/reports', reportRoutes);

export default router;