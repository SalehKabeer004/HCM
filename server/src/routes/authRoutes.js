const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/setup-status', authController.getSetupStatus);
router.post('/setup', authController.setup);
router.post('/login', authController.login);
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;