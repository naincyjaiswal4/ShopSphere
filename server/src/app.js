import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import productRoutes from './routes/productRoutes.js';
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
    message: 'ShopSphere API Running'
  });
});

// Mounted Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// 404 Not Found Handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err.message);
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

export default app;
