const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  officeStartTime: { type: String, default: '09:00' },
  gracePeriodMinutes: { type: Number, default: 15 },
  halfDayHoursThreshold: { type: Number, default: 5 },
  weekendDays: { type: [String], default: ['Saturday', 'Sunday'] },
  officeLat: { type: Number, default: 24.8607 }, // Default latitude
  officeLng: { type: Number, default: 67.0011 }, // Default longitude
  allowedRadiusMeters: { type: Number, default: 150 }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);