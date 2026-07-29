import express from 'express';
import { claimCertificate, verifyCertificate } from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public certificate verification route (NO AUTH)
router.get('/verify/:certificateId', verifyCertificate);

// Protected certificate claiming
router.post('/claim/:courseId', protect, claimCertificate);

export default router;
