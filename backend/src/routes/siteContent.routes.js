const express = require('express');
const router = express.Router();

const {
  getSiteContentPublic,
  updateSiteContentAdmin,
} = require('../controllers/siteContent.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/public', getSiteContentPublic);
router.patch('/admin', protect, adminOnly, updateSiteContentAdmin);

module.exports = router;
