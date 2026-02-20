const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware to protect routes - verifies JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'Accès non autorisé. Veuillez vous connecter.',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Utilisateur non trouvé.',
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        status: 'error',
        message: 'Token invalide ou expiré.',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Erreur serveur lors de l\'authentification.',
    });
  }
};

/**
 * Middleware to restrict access to admin users only
 */
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'Accès non autorisé. Veuillez vous connecter.',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      status: 'error',
      message: 'Accès interdit. Droits administrateur requis.',
    });
  }

  next();
};

/**
 * Middleware to check if user is the owner or admin
 */
const ownerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Accès non autorisé.',
      });
    }

    if (req.user.role === 'ADMIN' || req.user.id === resourceUserId) {
      return next();
    }

    return res.status(403).json({
      status: 'error',
      message: 'Accès interdit. Vous n\'êtes pas le propriétaire de cette ressource.',
    });
  };
};

module.exports = {
  protect,
  adminOnly,
  ownerOrAdmin,
};
