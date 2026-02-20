const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

/**
 * Get all properties with filters and pagination
 * GET /api/properties
 */
const getAllProperties = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const {
      page = 1,
      limit = 12,
      city,
      type,
      status,
      minPrice,
      maxPrice,
      minSurface,
      maxSurface,
      rooms,
      featured,
      search,
    } = req.query;

    // Build filter object
    const where = {};

    if (city) {
      where.city = { contains: city };
    }

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minSurface || maxSurface) {
      where.surface = {};
      if (minSurface) where.surface.gte = parseFloat(minSurface);
      if (maxSurface) where.surface.lte = parseFloat(maxSurface);
    }

    if (rooms) {
      where.rooms = { gte: parseInt(rooms) };
    }

    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { city: { contains: search } },
        { address: { contains: search } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Get properties with count
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / take);
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      status: 'success',
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          limit: take,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get featured properties
 * GET /api/properties/featured
 */
const getFeaturedProperties = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const properties = await prisma.property.findMany({
      where: { featured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: { properties },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get property by ID
 * GET /api/properties/:id
 */
const getPropertyById = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors GetPropertyById:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({
        status: 'error',
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!property) {
      return res.status(404).json({
        status: 'error',
        message: 'Propriété non trouvée.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new property (Admin only)
 * POST /api/properties
 */
const createProperty = async (req, res, next) => {
  try {
    console.log('Create Property Request Body:', JSON.stringify(req.body, null, 2));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation Errors Create:', JSON.stringify(errors.array(), null, 2));
      return res.status(400).json({
        status: 'error',
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const {
      title,
      description,
      price,
      type,
      status,
      city,
      address,
      surface,
      rooms,
      bathrooms,
      images,
      featured,
    } = req.body;

    const property = await prisma.property.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        type,
        status,
        city,
        address,
        surface: parseFloat(surface),
        rooms: parseInt(rooms),
        bathrooms: parseInt(bathrooms),
        images: images || [],
        featured: featured || false,
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Propriété créée avec succès',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update property (Admin only)
 * PATCH /api/properties/:id
 */
const updateProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({
        status: 'error',
        message: 'Propriété non trouvée.',
      });
    }

    const {
      title,
      description,
      price,
      type,
      status,
      city,
      address,
      surface,
      rooms,
      bathrooms,
      images,
      featured,
    } = req.body;

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (type !== undefined) updateData.type = type;
    if (status !== undefined) updateData.status = status;
    if (city !== undefined) updateData.city = city;
    if (address !== undefined) updateData.address = address;
    if (surface !== undefined) updateData.surface = parseFloat(surface);
    if (rooms !== undefined) updateData.rooms = parseInt(rooms);
    if (bathrooms !== undefined) updateData.bathrooms = parseInt(bathrooms);
    if (images !== undefined) updateData.images = images;
    if (featured !== undefined) updateData.featured = featured;

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Propriété mise à jour avec succès',
      data: { property },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete property (Admin only)
 * DELETE /api/properties/:id
 */
const deleteProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Erreur de validation',
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id },
    });

    if (!existingProperty) {
      return res.status(404).json({
        status: 'error',
        message: 'Propriété non trouvée.',
      });
    }

    // Delete uploaded images if they exist
    if (existingProperty.images && existingProperty.images.length > 0) {
      existingProperty.images.forEach(imagePath => {
        if (!imagePath.startsWith('http')) {
          const fullPath = path.join(__dirname, '../../uploads', imagePath.replace('/uploads/', ''));
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
      });
    }

    // Delete property
    await prisma.property.delete({
      where: { id },
    });

    res.status(200).json({
      status: 'success',
      message: 'Propriété supprimée avec succès',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get property statistics (Admin only)
 * GET /api/properties/stats/overview
 */
const getPropertyStats = async (req, res, next) => {
  try {
    const [
      totalProperties,
      forSaleCount,
      forRentCount,
      totalValue,
      propertiesByType,
      propertiesByCity,
      recentProperties,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: 'FOR_SALE' } }),
      prisma.property.count({ where: { status: 'FOR_RENT' } }),
      prisma.property.aggregate({
        _sum: { price: true },
      }),
      prisma.property.groupBy({
        by: ['type'],
        _count: { id: true },
      }),
      prisma.property.groupBy({
        by: ['city'],
        _count: { id: true },
        orderBy: {
          _count: { id: 'desc' },
        },
        take: 10,
      }),
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          price: true,
          city: true,
          createdAt: true,
        },
      }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          totalProperties,
          forSaleCount,
          forRentCount,
          totalValue: totalValue._sum.price || 0,
        },
        propertiesByType,
        propertiesByCity,
        recentProperties,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unique cities for filters
 * GET /api/properties/filters/cities
 */
const getCities = async (req, res, next) => {
  try {
    const cities = await prisma.property.groupBy({
      by: ['city'],
      orderBy: {
        city: 'asc',
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        cities: cities.map(c => c.city),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats,
  getCities,
};
