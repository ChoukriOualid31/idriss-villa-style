const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDashboardStats,
} = require('../controllers/user.controller');

const { protect, adminOnly } = require('../middleware/auth.middleware');

// All routes require admin authentication
router.use(protect, adminOnly);

router.get('/stats/dashboard', getDashboardStats);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
