import { Router } from 'express';
import { getAllReviews, deleteReview } from '../controllers/reviewController.js';

const router = Router();

// /api/reviews
router.route('/')
  .get(getAllReviews);

// /api/reviews/:id
router.route('/:id')
  .delete(deleteReview);

export default router;
