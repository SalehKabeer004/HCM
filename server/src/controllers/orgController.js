const Setting = require('../models/Setting');
const Department = require('../models/Department');

// Get company settings (create default if not exists)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update company settings (Admin only)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.status(200).json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a department (Admin only)
exports.createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const existing = await Department.findOne({ name });
    if (existing) {
      return res.status(400).json({ error: 'Department already exists.' });
    }
    const department = await Department.create({ name, description });
    res.status(201).json({ message: 'Department created successfully', department });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};