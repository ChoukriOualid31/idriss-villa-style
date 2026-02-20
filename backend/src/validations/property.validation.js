const { body, query, param } = require('express-validator');

const createPropertyValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 5, max: 200 })
    .withMessage('Le titre doit contenir entre 5 et 200 caractères'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ min: 3, max: 5000 })
    .withMessage('La description doit contenir entre 3 et 5000 caractères'),

  body('price')
    .notEmpty()
    .withMessage('Le prix est requis')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),

  body('type')
    .notEmpty()
    .withMessage('Le type de propriété est requis')
    .isIn(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'OFFICE', 'COMMERCIAL'])
    .withMessage('Type de propriété invalide'),

  body('status')
    .notEmpty()
    .withMessage('Le statut est requis')
    .isIn(['FOR_SALE', 'FOR_RENT'])
    .withMessage('Statut invalide'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('La ville est requise')
    .isLength({ min: 2, max: 100 })
    .withMessage('La ville doit contenir entre 2 et 100 caractères'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse est requise')
    .isLength({ min: 5, max: 300 })
    .withMessage('L\'adresse doit contenir entre 5 et 300 caractères'),

  body('surface')
    .notEmpty()
    .withMessage('La surface est requise')
    .isFloat({ min: 0 })
    .withMessage('La surface doit être un nombre positif'),

  body('rooms')
    .notEmpty()
    .withMessage('Le nombre de pièces est requis')
    .isInt({ min: 0 })
    .withMessage('Le nombre de pièces doit être un entier positif'),

  body('bathrooms')
    .notEmpty()
    .withMessage('Le nombre de salles de bain est requis')
    .isInt({ min: 0 })
    .withMessage('Le nombre de salles de bain doit être un entier positif'),

  body('images')
    .optional(),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured doit être un booléen'),
];

const updatePropertyValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Le titre doit contenir entre 5 et 200 caractères'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('La description doit contenir entre 20 et 5000 caractères'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),

  body('type')
    .optional()
    .isIn(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'OFFICE', 'COMMERCIAL'])
    .withMessage('Type de propriété invalide'),

  body('status')
    .optional()
    .isIn(['FOR_SALE', 'FOR_RENT'])
    .withMessage('Statut invalide'),

  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La ville doit contenir entre 2 et 100 caractères'),

  body('address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 300 })
    .withMessage('L\'adresse doit contenir entre 5 et 300 caractères'),

  body('surface')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La surface doit être un nombre positif'),

  body('rooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le nombre de pièces doit être un entier positif'),

  body('bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le nombre de salles de bain doit être un entier positif'),

  body('images')
    .optional(),

  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured doit être un booléen'),
];

const propertyFilterValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La page doit être un entier positif'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),

  query('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('La ville doit contenir entre 1 et 100 caractères'),

  query('type')
    .optional()
    .isIn(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'OFFICE', 'COMMERCIAL'])
    .withMessage('Type de propriété invalide'),

  query('status')
    .optional()
    .isIn(['FOR_SALE', 'FOR_RENT'])
    .withMessage('Statut invalide'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix minimum doit être un nombre positif'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix maximum doit être un nombre positif'),

  query('minSurface')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La surface minimum doit être un nombre positif'),

  query('maxSurface')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('La surface maximum doit être un nombre positif'),

  query('rooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Le nombre de pièces doit être un entier positif'),

  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured doit être un booléen'),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('La recherche doit contenir entre 1 et 100 caractères'),
];

const propertyIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de la propriété est requis')
    .isUUID()
    .withMessage('ID de propriété invalide'),
];

module.exports = {
  createPropertyValidation,
  updatePropertyValidation,
  propertyFilterValidation,
  propertyIdValidation,
};
