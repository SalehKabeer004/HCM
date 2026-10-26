const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, employeeController.getEmployees);
router.post('/', verifyToken, requireRole(['Admin', 'HR']), employeeController.createEmployee);

module.exports = router;