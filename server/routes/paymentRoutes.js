import express from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  processOrder,
  getPaymentHistory,
  getInstructorEarnings,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { validateCheckout } from '../middleware/validator.js';

import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

// Webhook route (must be unauthenticated and receive raw body)
router.post('/webhook', handleWebhook);

// Protected student routes
router.post('/checkout-session', protect, validateCheckout, createCheckoutSession);
router.post('/process-order', protect, processOrder);
router.get('/history', protect, getPaymentHistory);

// Protected instructor routes (cached 300s, user-namespaced)
router.get('/instructor-earnings', protect, authorize('instructor', 'admin'), cacheMiddleware('instructor_earnings', 300), getInstructorEarnings);

export default router;
