import express from 'express';
import { generateNotes, generateQuiz } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/notes/:courseId/:lectureId', generateNotes);
router.post('/quiz/:courseId/:lectureId', generateQuiz);

export default router;
