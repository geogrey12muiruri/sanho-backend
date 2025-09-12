import express from 'express';
import partsRoutes from './parts.js';
import categoriesRoutes from './categories.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/parts', partsRoutes);
router.use('/categories', categoriesRoutes);

export default router;
