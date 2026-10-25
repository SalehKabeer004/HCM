const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, leaveController.getLeaves);
router.post('/', verifyToken, leaveController.applyLeave);
router.put('/:id', verifyToken, requireRole(['Admin', 'HR']), leaveController.updateLeaveStatus);

module.exports = router;