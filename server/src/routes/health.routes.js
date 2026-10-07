import { Router } from 'express';

const router = Router();

// Health Check Route -> GET /api/health
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ShopSphere API is running'
  });
});

export default router;
