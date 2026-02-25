const router = require('express').Router();
const authGuard = require('../helpers/authguagrd');
const isAdmin = require('../helpers/isAdmin');
const settingsController = require('../controllers/settingsController');

// Admin-only settings
router.get('/settings', authGuard, isAdmin, settingsController.getSettings);
router.put('/settings', authGuard, isAdmin, settingsController.updateSettings);

module.exports = router;