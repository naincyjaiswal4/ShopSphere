import { Router } from 'express';
import healthRoutes from './health.routes.js';
import productRoutes from './productRoutes.js';
import authRoutes from './auth.routes.js';
import orderRoutes from './order.routes.js';
import reviewRoutes from './reviewRoutes.js';

const router = Router();

// Mount feature routes
router.use('/', healthRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);

export default router;

