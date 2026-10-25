const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department', 'name').select('-password').sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new employee (Admin/HR only)
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, department, designation, salary, joiningDate } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Employee with this email already exists.' });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Employee',
      department,
      designation,
      salary,
      joiningDate
    });

    // Return without password
    const employeeResponse = employee.toObject();
    delete employeeResponse.password;

    res.status(201).json({ message: 'Employee created successfully', employee: employeeResponse });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};