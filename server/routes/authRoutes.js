import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  getUserCart,
  addToUserCart,
  removeFromUserCart,
  clearUserCart,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authRateLimiter, loginRateLimiter } from '../middleware/rateLimiter.js';
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from '../middleware/validator.js';

const router = express.Router();

// Apply rate limiter to all auth routes
router.use(authRateLimiter);

router.post('/register', validateRegister, register);
router.post('/login', loginRateLimiter, validateLogin, login);
router.get('/me', protect, getMe);
router.post('/logout', logout);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

// Cart routes backed by MongoDB
router.get('/cart', protect, getUserCart);
router.post('/cart', protect, addToUserCart);
router.delete('/cart/:courseId', protect, removeFromUserCart);
router.delete('/cart', protect, clearUserCart);

export default router;
