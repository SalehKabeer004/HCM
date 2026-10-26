const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.createUser = async (req, res) => {
  const { name, email, password, role, employeeId, mustChangePassword, isActive } = req.body || {};

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof password !== 'string' || !password ||
    typeof role !== 'string' || !role
  ) {
    return res.status(400).json({ error: 'Name, email, password, and role are required.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      employeeId,
      mustChangePassword,
      isActive
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({
      message: 'User created successfully.',
      user: userResponse
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: err.message });
    }

    console.error('User creation error:', err);
    return res.status(500).json({ error: 'Failed to create user.' });
  }
};
