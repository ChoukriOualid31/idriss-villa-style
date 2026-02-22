const path = require('path');
const fs = require('fs');
const { uploadBuffer, deleteByPublicId, publicIdFromUrl } = require('../services/cloudinary.service');

const isServerless = Boolean(process.env.VERCEL);

/**
 * Upload single image
 * POST /api/upload/image
 */
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'Aucune image fournie',
    });
  }

  // Production (Vercel): file is in memory buffer — upload to Cloudinary
  if (isServerless) {
    try {
      const { url, publicId } = await uploadBuffer(req.file.buffer, req.file.originalname);
      return res.status(200).json({
        status: 'success',
        message: 'Image téléchargée avec succès',
        data: {
          filename: publicId,
          url,
          originalName: req.file.originalname,
          size: req.file.size,
        },
      });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors du téléchargement vers Cloudinary.',
      });
    }
  }

  // Development: file saved on disk
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
const uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Aucune image fournie',
    });
  }

  // Production: upload each file to Cloudinary
  if (isServerless) {
    try {
      const uploaded = await Promise.all(
        req.files.map((file) => uploadBuffer(file.buffer, file.originalname))
      );
      const images = uploaded.map((result, i) => ({
        filename: result.publicId,
        url: result.url,
        originalName: req.files[i].originalname,
        size: req.files[i].size,
      }));
      return res.status(200).json({
        status: 'success',
        message: `${images.length} image(s) téléchargée(s) avec succès`,
        data: { images },
      });
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors du téléchargement vers Cloudinary.',
      });
    }
  }

  // Development: files saved on disk
  const uploadedFiles = req.files.map((file) => ({
    filename: file.filename,
    url: `${req.protocol}://${req.get('host')}/uploads/properties/${file.filename}`,
    originalName: file.originalname,
    size: file.size,
  }));

  res.status(200).json({
    status: 'success',
    message: `${req.files.length} image(s) téléchargée(s) avec succès`,
    data: { images: uploadedFiles },
  });
};

/**
 * Delete uploaded image
 * DELETE /api/upload/image/:filename
 */
const deleteImage = async (req, res) => {
  const { filename } = req.params;

  // Production: delete from Cloudinary using public_id or URL
  if (isServerless) {
    try {
      // filename param can be a full Cloudinary URL or a public_id
      const publicId = filename.startsWith('http')
        ? publicIdFromUrl(decodeURIComponent(filename))
        : decodeURIComponent(filename);

      if (!publicId) {
        return res.status(400).json({ status: 'error', message: 'Identifiant image invalide.' });
      }

      await deleteByPublicId(publicId);
      return res.status(200).json({ status: 'success', message: 'Image supprimée avec succès' });
    } catch (err) {
      console.error('Cloudinary delete error:', err);
      return res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression.' });
    }
  }

  // Development: delete from local disk
  if (filename.includes('..') || filename.includes('/')) {
    return res.status(400).json({ status: 'error', message: 'Nom de fichier invalide' });
  }

  const filePath = path.join(__dirname, '../../uploads/properties', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ status: 'error', message: 'Fichier non trouvé' });
  }

  try {
    fs.unlinkSync(filePath);
    res.status(200).json({ status: 'success', message: 'Image supprimée avec succès' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ status: 'error', message: "Erreur lors de la suppression de l'image" });
  }
};

module.exports = { uploadImage, uploadImages, deleteImage };
