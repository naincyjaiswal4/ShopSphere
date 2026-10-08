import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getAllUsers,
  getAuthStats
} from '../controllers/auth.controller.js';

const router = Router();

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   GET /api/auth/users
router.get('/users', getAllUsers);

// @route   GET /api/auth/stats
router.get('/stats', getAuthStats);

export default router;

