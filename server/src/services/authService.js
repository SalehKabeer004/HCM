const User = require('../models/User');
const Employee = require('../models/Employee'); // Employee model add kiya
const Company = require('../models/Company');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hcm_secret_key_12345';

// Check if system has an admin/company configured
exports.checkSetupStatus = async () => {
  const company = await Company.findOne();
  const adminExists = await User.findOne({ role: 'Admin' });
  return { isSetup: !!(company && adminExists) };
};

// First-run setup: creates company and initial Admin user
exports.setupSystem = async ({ companyName, adminName, adminEmail, adminPassword }) => {
  const existingCompany = await Company.findOne();
  if (existingCompany) {
    throw new Error('System is already set up.');
  }

  // Create company
  const company = await Company.create({ name: companyName, setupCompleted: true });

  // Hash admin password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  // Create Admin user
  const admin = await User.create({
    name: adminName,
    email: adminEmail,
    password: hashedPassword,
    role: 'Admin',
    mustChangePassword: false
  });

  return { company, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } };
};

// Login user (Supports both User and Employee Models)
exports.loginUser = async ({ email, password }) => {
  // Pehle User model me dhoondho, agar na mile toh Employee model me dhoondho
  let user = await User.findOne({ email });
  
  if (!user) {
    user = await Employee.findOne({ email });
  }

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Check if account is active (if status key exists)
  if (user.isActive === false) {
    throw new Error('Account is inactive.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  // Generate JWT token (id, userId, _id sab shamil karein safety ke liye)
  const token = jwt.sign(
    { 
      id: user._id, 
      userId: user._id, 
      role: user.role, 
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword || false,
      employeeId: user._id
    }
  };
};

// Change password
exports.changePassword = async (userId, oldPassword, newPassword) => {
  let user = await User.findById(userId);
  if (!user) {
    user = await Employee.findById(userId);
  }
  if (!user) throw new Error('User not found.');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error('Incorrect old password.');

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.mustChangePassword = false;
  await user.save();

  return { message: 'Password updated successfully.' };
};

exports.fixAdminPassword = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('12345678', salt);
  
  await User.findOneAndUpdate(
    { email: 'admin@hcm.com' },
    { password: hashedPassword }
  );
  console.log('Admin password updated with correct bcrypt hash!');
};