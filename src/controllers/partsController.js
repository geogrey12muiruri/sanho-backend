import database from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Get all parts with optional filtering and pagination
 */
export const getParts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      limit = 50,
      page = 1,
      sortBy = 'title',
      sortOrder = 'asc'
    } = req.query;

    const prisma = database.getClient();
    
    // Build where clause
    const where = {
      isActive: true,
    };

    // Category filter - handle both parent and child categories
    if (category && category !== 'all') {
      // First check if it's a parent category
      const parentCategory = await prisma.category.findUnique({
        where: { slug: category },
        include: { children: true }
      });
      
      if (parentCategory && parentCategory.children.length > 0) {
        // If it's a parent category, get all child category IDs
        const childCategoryIds = parentCategory.children.map(child => child.id);
        where.categoryId = {
          in: childCategoryIds
        };
      } else {
        // If it's a child category, filter by slug
        where.category = {
          slug: category
        };
      }
    }

    // Search filter
    if (search) {
      where.OR = [
        { partNumber: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { oemNumber: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build orderBy clause
    const orderBy = {};
    if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'partNumber') {
      orderBy.partNumber = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.title = sortOrder;
    }

    // Execute query
    const [parts, totalCount] = await Promise.all([
      prisma.part.findMany({
        where,
        include: {
          category: true,
          manufacturer: true,
          compatibilities: {
            include: {
              machineModel: {
                include: {
                  manufacturer: true
                }
              }
            }
          }
        },
        orderBy,
        skip,
        take,
      }),
      prisma.part.count({ where })
    ]);

    // Transform data for frontend
    const transformedParts = parts.map(part => ({
      id: part.id,
      partNumber: part.partNumber,
      oemNumber: part.oemNumber,
      title: part.title,
      description: part.description,
      shortDescription: part.shortDescription,
      price: part.price ? Number(part.price) : undefined,
      externalLink: part.externalLink,
      images: part.images,
      tags: part.tags,
      category: {
        name: part.category.name,
        slug: part.category.slug
      },
      manufacturer: part.manufacturer ? {
        name: part.manufacturer.name
      } : undefined,
      compatibilities: part.compatibilities.map(compat => ({
        machineModel: {
          name: compat.machineModel.name,
          manufacturer: {
            name: compat.machineModel.manufacturer.name
          }
        }
      }))
    }));

    const totalPages = Math.ceil(totalCount / take);

    logger.info(`Retrieved ${parts.length} parts for query: ${JSON.stringify(req.query)}`);

    res.json({
      success: true,
      data: {
        parts: transformedParts,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          limit: take,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    logger.error('Error fetching parts:', error);
    next(error);
  }
};

/**
 * Get a single part by ID
 */
export const getPartById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = database.getClient();

    const part = await prisma.part.findUnique({
      where: { id },
      include: {
        category: true,
        manufacturer: true,
        compatibilities: {
          include: {
            machineModel: {
              include: {
                manufacturer: true
              }
            }
          }
        }
      }
    });

    if (!part) {
      return res.status(404).json({
        success: false,
        error: 'Part not found'
      });
    }

    // Transform data for frontend
    const transformedPart = {
      id: part.id,
      partNumber: part.partNumber,
      oemNumber: part.oemNumber,
      title: part.title,
      description: part.description,
      shortDescription: part.shortDescription,
      price: part.price ? Number(part.price) : undefined,
      externalLink: part.externalLink,
      images: part.images,
      tags: part.tags,
      category: {
        name: part.category.name,
        slug: part.category.slug
      },
      manufacturer: part.manufacturer ? {
        name: part.manufacturer.name
      } : undefined,
      compatibilities: part.compatibilities.map(compat => ({
        machineModel: {
          name: compat.machineModel.name,
          manufacturer: {
            name: compat.machineModel.manufacturer.name
          }
        }
      }))
    };

    logger.info(`Retrieved part: ${part.partNumber}`);

    res.json({
      success: true,
      data: { part: transformedPart }
    });

  } catch (error) {
    logger.error('Error fetching part by ID:', error);
    next(error);
  }
};

/**
 * Add external link to a part
 */
export const addExternalLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { externalLink } = req.body;
    const prisma = database.getClient();

    const part = await prisma.part.update({
      where: { id },
      data: { externalLink },
      include: {
        category: true,
        manufacturer: true
      }
    });

    if (!part) {
      return res.status(404).json({
        success: false,
        error: 'Part not found'
      });
    }

    logger.info(`Added external link to part: ${part.partNumber}`);

    res.json({
      success: true,
      message: 'External link added successfully',
      data: { part }
    });

  } catch (error) {
    logger.error('Error adding external link:', error);
    next(error);
  }
};

/**
 * Get parts statistics
 */
export const getPartsStats = async (req, res, next) => {
  try {
    const prisma = database.getClient();

    const [
      totalParts,
      partsWithExternalLinks,
      partsByCategory,
      recentParts
    ] = await Promise.all([
      prisma.part.count({ where: { isActive: true } }),
      prisma.part.count({ 
        where: { 
          isActive: true, 
          externalLink: { not: null } 
        } 
      }),
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { parts: { where: { isActive: true } } }
          }
        }
      }),
      prisma.part.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          partNumber: true,
          title: true,
          createdAt: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalParts,
        partsWithExternalLinks,
        partsWithoutExternalLinks: totalParts - partsWithExternalLinks,
        partsByCategory: partsByCategory.map(cat => ({
          name: cat.name,
          slug: cat.slug,
          count: cat._count.parts
        })),
        recentParts
      }
    });

  } catch (error) {
    logger.error('Error fetching parts statistics:', error);
    next(error);
  }
};
