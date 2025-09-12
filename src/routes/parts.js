import express from 'express';
import {
  getParts,
  getPartById,
  addExternalLink,
  getPartsStats
} from '../controllers/partsController.js';
import { validateQuery, validate, schemas } from '../middleware/validation.js';
import { generalLimiter, searchLimiter } from '../middleware/rateLimiter.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// Apply rate limiting
router.use(generalLimiter);

/**
 * @route   GET /api/parts
 * @desc    Get all parts with optional filtering and pagination
 * @access  Public
 */
router.get(
  '/',
  searchLimiter,
  validateQuery(schemas.partsQuery),
  asyncHandler(getParts)
);

/**
 * @route   GET /api/parts/stats
 * @desc    Get parts statistics
 * @access  Public
 */
router.get(
  '/stats',
  asyncHandler(getPartsStats)
);

/**
 * @route   GET /api/parts/:id
 * @desc    Get a single part by ID
 * @access  Public
 */
router.get(
  '/:id',
  asyncHandler(getPartById)
);

/**
 * @route   POST /api/parts/:id/external-link
 * @desc    Add external link to a part
 * @access  Public (in production, this should be protected)
 */
router.post(
  '/:id/external-link',
  validate(schemas.addExternalLink),
  asyncHandler(addExternalLink)
);

export default router;
