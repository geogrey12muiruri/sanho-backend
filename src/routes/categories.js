import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  getCategoryStats
} from '../controllers/categoriesController.js';
import { generalLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Apply rate limiting
router.use(generalLimiter);

/**
 * @route   GET /api/categories
 * @desc    Get all categories with their subcategories
 * @access  Public
 */
router.get(
  '/',
  asyncHandler(getCategories)
);

/**
 * @route   GET /api/categories/stats
 * @desc    Get category statistics
 * @access  Public
 */
router.get(
  '/stats',
  asyncHandler(getCategoryStats)
);

/**
 * @route   GET /api/categories/:slug
 * @desc    Get a single category by slug
 * @access  Public
 */
router.get(
  '/:slug',
  asyncHandler(getCategoryBySlug)
);

export default router;
