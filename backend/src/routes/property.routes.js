const express = require('express');
const router = express.Router();

const {
  getAllProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyStats,
  getCities,
} = require('../controllers/property.controller');

const {
  createPropertyValidation,
  updatePropertyValidation,
  propertyFilterValidation,
  propertyIdValidation,
} = require('../validations/property.validation');

const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes
router.get('/', propertyFilterValidation, getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/filters/cities', getCities);
router.get('/stats/overview', protect, adminOnly, getPropertyStats);
router.get('/:id', propertyIdValidation, getPropertyById);

// Protected admin routes
router.post('/', protect, adminOnly, createPropertyValidation, createProperty);
router.patch('/:id', protect, adminOnly, updatePropertyValidation, updateProperty);
router.delete('/:id', protect, adminOnly, propertyIdValidation, deleteProperty);

module.exports = router;
