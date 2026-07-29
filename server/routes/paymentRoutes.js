import express from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
  getInstructorEarnings,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Webhook route (must be unauthenticated and receive raw body)
router.post('/webhook', handleWebhook);

// Protected student routes
router.post('/checkout-session', protect, createCheckoutSession);
router.get('/history', protect, getPaymentHistory);

// Protected instructor routes
router.get('/instructor-earnings', protect, authorize('instructor', 'admin'), getInstructorEarnings);

export default router;
