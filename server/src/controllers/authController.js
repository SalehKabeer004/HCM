const authService = require('../services/authService');

exports.getSetupStatus = async (req, res) => {
  try {
    const status = await authService.checkSetupStatus();
    res.status(200).json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setup = async (req, res) => {
  try {
    const result = await authService.setupSystem(req.body);
    res.status(201).json({ message: 'System setup successful', ...result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.userId, oldPassword, newPassword);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};