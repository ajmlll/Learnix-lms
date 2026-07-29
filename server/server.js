import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

import connectDB from './config/db.js';
import redisClient, { connectRedis } from './config/redis.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

const app = express();

// Middlewares
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/courses', courseRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const redisState = redisClient.isOpen ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    db: dbState,
    redis: redisState,
    timestamp: new Date().toISOString(),
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Database connections
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`[Learnix Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();
