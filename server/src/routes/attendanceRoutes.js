const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/check-in', verifyToken, attendanceController.checkIn);

router.get('/', verifyToken, attendanceController.getAttendance);

module.exports = router;