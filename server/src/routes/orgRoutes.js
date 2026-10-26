const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/settings', verifyToken, orgController.getSettings);
router.put('/settings', verifyToken, requireRole(['Admin']), orgController.updateSettings);

router.get('/departments', verifyToken, orgController.getDepartments);
router.post('/departments', verifyToken, requireRole(['Admin']), orgController.createDepartment);

module.exports = router;