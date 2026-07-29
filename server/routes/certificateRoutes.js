import express from 'express';
import { claimCertificate, verifyCertificate } from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';

import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

// Public certificate verification route (NO AUTH, 3600s cache)
router.get('/verify/:certificateId', cacheMiddleware('cert_verify', 3600), verifyCertificate);

// Protected certificate claiming
router.post('/claim/:courseId', protect, claimCertificate);

export default router;
