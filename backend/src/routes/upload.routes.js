const express = require('express');
const router = express.Router();

const {
  uploadImage,
  uploadImages,
  deleteImage,
} = require('../controllers/upload.controller');

const {
  uploadSingleImage,
  uploadMultipleImages,
  handleUploadError,
} = require('../middleware/upload.middleware');

const { protect, adminOnly } = require('../middleware/auth.middleware');

// All upload routes require admin authentication
router.use(protect, adminOnly);

// Single image upload
router.post('/image', uploadSingleImage, handleUploadError, uploadImage);

// Multiple images upload
router.post('/images', uploadMultipleImages, handleUploadError, uploadImages);

// Delete image
router.delete('/image/:filename', deleteImage);

module.exports = router;
