import express from 'express';
import {
  createDiscussion,
  getCourseDiscussions,
  addReply,
  toggleUpvote,
  deleteDiscussion,
} from '../controllers/discussionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/course/:courseId', getCourseDiscussions);
router.post('/course/:courseId', protect, createDiscussion);
router.post('/:id/replies', protect, addReply);
router.put('/:id/upvote', protect, toggleUpvote);
router.delete('/:id', protect, deleteDiscussion);

export default router;
