import express from 'express';
import {
  scheduleLiveClass,
  getLiveClassesByCourse,
  joinLiveClass,
  updateLiveClass,
  deleteLiveClass,
} from '../controllers/liveClassController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

router.get('/course/:courseId', cacheMiddleware('live_classes', 60), getLiveClassesByCourse);

router.post('/', protect, authorize('instructor', 'admin'), scheduleLiveClass);
router.post('/:id/join', protect, joinLiveClass);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLiveClass);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLiveClass);

export default router;
