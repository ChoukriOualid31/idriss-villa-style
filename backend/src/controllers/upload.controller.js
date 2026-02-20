const path = require('path');
const fs = require('fs');

/**
 * Upload single image
 * POST /api/upload/image
 */
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'Aucune image fournie',
    });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/properties/${req.file.filename}`;

  res.status(200).json({
    status: 'success',
    message: 'Image téléchargée avec succès',
    data: {
      filename: req.file.filename,
      url: imageUrl,
      originalName: req.file.originalname,
      size: req.file.size,
    },
  });
};

/**
 * Upload multiple images
 * POST /api/upload/images
 */
const uploadImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Aucune image fournie',
    });
  }

  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    url: `${req.protocol}://${req.get('host')}/uploads/properties/${file.filename}`,
    originalName: file.originalname,
    size: file.size,
  }));

  res.status(200).json({
    status: 'success',
    message: `${req.files.length} image(s) téléchargée(s) avec succès`,
    data: {
      images: uploadedFiles,
    },
  });
};

/**
 * Delete uploaded image
 * DELETE /api/upload/image/:filename
 */
const deleteImage = (req, res) => {
  const { filename } = req.params;

  // Security: prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({
      status: 'error',
      message: 'Nom de fichier invalide',
    });
  }

  const filePath = path.join(__dirname, '../../uploads/properties', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: 'error',
      message: 'Fichier non trouvé',
    });
  }

  try {
    fs.unlinkSync(filePath);

    res.status(200).json({
      status: 'success',
      message: 'Image supprimée avec succès',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la suppression de l\'image',
    });
  }
};

module.exports = {
  uploadImage,
  uploadImages,
  deleteImage,
};
