const Leave = require('../models/Leave');

// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const leave = await Leave.create({
      employee: req.user.id,
      leaveType,
      startDate,
      endDate,
      reason
    });
    res.status(201).json({ message: 'Leave application submitted successfully', leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get leaves (Employee sees own, Admin/HR sees all)
exports.getLeaves = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Employee') {
      query.employee = req.user.id;
    }
    const leaves = await Leave.find(query).populate('employee', 'name email').sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update leave status (Admin/HR only)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body; // Approved or Rejected
    const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!leave) return res.status(404).json({ error: 'Leave request not found.' });
    res.status(200).json({ message: `Leave status updated to ${status}`, leave });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};