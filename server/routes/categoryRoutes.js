import express from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';
import { cacheMiddleware } from '../middleware/cache.js';
import { validateCategory } from '../middleware/validator.js';

const router = express.Router();

router
  .route('/')
  .get(cacheMiddleware('categories', 3600), getCategories)
  .post(protect, authorize('admin'), validateCategory, createCategory);

router
  .route('/:id')
  .get(cacheMiddleware('category_detail', 3600), getCategoryById)
  .put(protect, authorize('admin'), validateCategory, updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;
