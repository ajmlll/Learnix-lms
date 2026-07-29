import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import connectDB from './config/db.js';
import redisClient, { connectRedis } from './config/redis.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import codeExecutionRoutes from './routes/codeExecutionRoutes.js';
import liveClassRoutes from './routes/liveClassRoutes.js';
import discussionRoutes from './routes/discussionRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { handleWebhook } from './controllers/paymentController.js';

const app = express();

// Security Headers
app.use(helmet());

// Middlewares
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);

// Raw body parsing for Stripe Webhook before express.json()
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
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
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/code', codeExecutionRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);

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

// Global 404 Handler for Unmatched API Routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route '${req.originalUrl}' not found.`,
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
