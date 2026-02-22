const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const isServerless = Boolean(process.env.VERCEL);

// Upload directories (only relevant in local/dev)
const uploadDirs = {
  properties: path.join(__dirname, '../../uploads/properties'),
};

// Only attempt local dir creation in development
if (!isServerless) {
  Object.values(uploadDirs).forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (e) {
      // Ignore — read-only filesystem
    }
  });
}

// In production (Vercel), use memory storage because the local filesystem is
// ephemeral and read-only. Integrate Cloudinary/S3 for persistent file storage.
const createStorage = (folderName) => {
  if (isServerless) {
    return multer.memoryStorage();
  }
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirs[folderName]);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
};

// File filter
const fileFilter = (allowedTypes) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    const isAllowedExt = allowedTypes.includes(ext);
    const isAllowedMime = allowedTypes.some(type => mimeType.startsWith(type.replace('.', '')));

    if (isAllowedExt || isAllowedMime) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non supporté. Types acceptés: ${allowedTypes.join(', ')}`), false);
    }
  };
};

// Image upload configuration
const imageUpload = multer({
  storage: createStorage('properties'),
  fileFilter: fileFilter(['.jpg', '.jpeg', '.png', '.webp']),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 10, // Max 10 files
  },
});

// Single image upload
const uploadSingleImage = imageUpload.single('image');

// Multiple images upload
const uploadMultipleImages = imageUpload.array('images', 10);

// Error handler for multer
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'Fichier trop volumineux. Taille maximale: 5MB',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        status: 'error',
        message: 'Nombre maximum de fichiers dépassé (10 maximum)',
      });
    }
    return res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
  
  if (err) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
  
  next();
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  handleUploadError,
  uploadDirs,
};
