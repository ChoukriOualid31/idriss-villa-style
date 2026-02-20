const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/auth.controller');

const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
} = require('../validations/auth.validation');

const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.patch('/update-profile', protect, updateProfileValidation, updateProfile);
router.patch('/change-password', protect, changePasswordValidation, changePassword);

module.exports = router;
