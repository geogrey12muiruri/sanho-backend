import database from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Get all categories with their subcategories
 */
export const getCategories = async (req, res, next) => {
  try {
    const prisma = database.getClient();

    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        },
        _count: {
          select: { parts: { where: { isActive: true } } }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    // Transform data for frontend
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      partsCount: category._count.parts,
      children: category.children.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        parentId: child.parentId,
        isActive: child.isActive,
        sortOrder: child.sortOrder,
        partsCount: child._count?.parts || 0
      }))
    }));

    logger.info(`Retrieved ${categories.length} categories`);

    res.json({
      success: true,
      data: { categories: transformedCategories }
    });

  } catch (error) {
    logger.error('Error fetching categories:', error);
    next(error);
  }
};

/**
 * Get a single category by slug
 */
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const prisma = database.getClient();

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        },
        parent: true,
        _count: {
          select: { parts: { where: { isActive: true } } }
        }
      }
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Transform data for frontend
    const transformedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      partsCount: category._count.parts,
      parent: category.parent ? {
        id: category.parent.id,
        name: category.parent.name,
        slug: category.parent.slug
      } : null,
      children: category.children.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        parentId: child.parentId,
        isActive: child.isActive,
        sortOrder: child.sortOrder,
        partsCount: child._count?.parts || 0
      }))
    };

    logger.info(`Retrieved category: ${category.name}`);

    res.json({
      success: true,
      data: { category: transformedCategory }
    });

  } catch (error) {
    logger.error('Error fetching category by slug:', error);
    next(error);
  }
};

/**
 * Get category statistics
 */
export const getCategoryStats = async (req, res, next) => {
  try {
    const prisma = database.getClient();

    const [
      totalCategories,
      activeCategories,
      categoriesWithParts,
      topCategories
    ] = await Promise.all([
      prisma.category.count(),
      prisma.category.count({ where: { isActive: true } }),
      prisma.category.count({
        where: {
          isActive: true,
          parts: {
            some: { isActive: true }
          }
        }
      }),
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: { parts: { where: { isActive: true } } }
          }
        },
        orderBy: {
          parts: {
            _count: 'desc'
          }
        },
        take: 10
      })
    ]);

    res.json({
      success: true,
      data: {
        totalCategories,
        activeCategories,
        categoriesWithParts,
        topCategories: topCategories.map(cat => ({
          name: cat.name,
          slug: cat.slug,
          partsCount: cat._count.parts
        }))
      }
    });

  } catch (error) {
    logger.error('Error fetching category statistics:', error);
    next(error);
  }
};


