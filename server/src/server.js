import dotenv from 'dotenv';
import connectDB from './config/db.js';
import app from './app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas / Database before starting the HTTP server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`ShopSphere server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
  });
};

startServer();
