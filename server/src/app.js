import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();

// Base Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ShopSphere API',
    version: '1.0.0'
  });
});

// Centralized API Routes
app.use('/api', apiRoutes);

export default app;
