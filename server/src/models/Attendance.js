const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date },
  status: { type: String, enum: ['Present', 'Late', 'Half-Day', 'Absent'], default: 'Present' },
  checkInLocation: {
    lat: Number,
    lng: Number
  },
  isWithinRadius: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);