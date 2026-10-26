const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.post('/create', verifyToken, requireRole(['Admin']), userController.createUser);

module.exports = router;
