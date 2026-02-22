const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} originalname - Original filename (used to derive extension)
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadBuffer = (buffer, originalname) => {
  return new Promise((resolve, reject) => {
    const resourceType = 'image';
    const folder = 'idriss-villa/properties';

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by its public_id.
 * @param {string} publicId
 */
const deleteByPublicId = (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Extract a Cloudinary public_id from a secure URL.
 * e.g. https://res.cloudinary.com/demo/image/upload/v123/idriss-villa/properties/abc.jpg
 * → idriss-villa/properties/abc
 */
const publicIdFromUrl = (url) => {
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    const withVersion = parts[1]; // e.g. v123/idriss-villa/properties/abc.jpg
    const withoutVersion = withVersion.replace(/^v\d+\//, '');
    return withoutVersion.replace(/\.[^.]+$/, ''); // remove extension
  } catch {
    return null;
  }
};

module.exports = { uploadBuffer, deleteByPublicId, publicIdFromUrl };
