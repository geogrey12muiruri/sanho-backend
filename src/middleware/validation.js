import Joi from 'joi';

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
    
    next();
  };
};

/**
 * Query validation middleware
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
    
    next();
  };
};

/**
 * Common validation schemas
 */
export const schemas = {
  // Parts validation
  createPart: Joi.object({
    partNumber: Joi.string().required().min(1).max(100),
    oemNumber: Joi.string().optional().max(100),
    title: Joi.string().required().min(1).max(200),
    description: Joi.string().optional().max(1000),
    shortDescription: Joi.string().optional().max(500),
    price: Joi.number().optional().min(0),
    externalLink: Joi.string().uri().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    categoryId: Joi.string().required(),
    manufacturerId: Joi.string().optional(),
  }),

  updatePart: Joi.object({
    partNumber: Joi.string().optional().min(1).max(100),
    oemNumber: Joi.string().optional().max(100),
    title: Joi.string().optional().min(1).max(200),
    description: Joi.string().optional().max(1000),
    shortDescription: Joi.string().optional().max(500),
    price: Joi.number().optional().min(0),
    externalLink: Joi.string().uri().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    categoryId: Joi.string().optional(),
    manufacturerId: Joi.string().optional(),
  }),

  // Parts query validation
  partsQuery: Joi.object({
    category: Joi.string().optional(),
    search: Joi.string().optional().max(100),
    limit: Joi.number().integer().min(1).max(100).optional(),
    page: Joi.number().integer().min(1).optional(),
    sortBy: Joi.string().valid('title', 'partNumber', 'price', 'createdAt').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').optional(),
  }),

  // Category validation
  createCategory: Joi.object({
    name: Joi.string().required().min(1).max(100),
    slug: Joi.string().required().min(1).max(100),
    description: Joi.string().optional().max(500),
    parentId: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    sortOrder: Joi.number().integer().optional(),
  }),

  // Manufacturer validation
  createManufacturer: Joi.object({
    name: Joi.string().required().min(1).max(100),
    description: Joi.string().optional().max(500),
    website: Joi.string().uri().optional(),
    isActive: Joi.boolean().optional(),
  }),

  // External link validation
  addExternalLink: Joi.object({
    externalLink: Joi.string().uri().required(),
  }),
};


