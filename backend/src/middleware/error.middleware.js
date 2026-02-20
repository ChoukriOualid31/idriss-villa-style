/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur serveur interne';
  let errors = err.errors || null;

  // Handle specific error types
  
  // Prisma errors
  if (err.code) {
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        statusCode = 409;
        const field = err.meta?.target?.[0] || 'champ';
        message = `Cette valeur existe déjà pour le champ ${field}.`;
        break;
      case 'P2025': // Record not found
        statusCode = 404;
        message = 'Ressource non trouvée.';
        break;
      case 'P2003': // Foreign key constraint
        statusCode = 400;
        message = 'Contrainte de clé étrangère violée.';
        break;
      default:
        break;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide.';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré.';
  }

  // Validation errors (express-validator)
  if (err.name === 'ValidationError' || (errors && Array.isArray(errors))) {
    statusCode = 400;
    message = 'Erreur de validation';
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'Fichier trop volumineux. Taille maximale: 5MB';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Type de fichier non attendu.';
  }

  // Send error response
  const errorResponse = {
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      code: err.code,
    }),
  };

  if (errors) {
    errorResponse.errors = errors;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  ApiError,
};
