const Attendance = require('../models/Attendance');
const Setting = require('../models/Setting');

// Helper function to calculate distance in meters (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Check-In API
exports.checkIn = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    // Yahan check karein ke req.user.id mil raha hai ya req.user._id
    const employeeId = req.user.id || req.user._id; 

    if (!employeeId) {
      return res.status(401).json({ error: 'Unauthorized: Employee ID missing in token.' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Baki code wahi rahega...
    const existing = await Attendance.findOne({ employee: employeeId, date: today });
    if (existing) {
      return res.status(400).json({ error: 'You have already checked in today.' });
    }

    const settings = await Setting.findOne();
    if (!settings || settings.officeLat == null || settings.officeLng == null) {
      return res.status(500).json({ error: 'Office GPS location not configured in settings.' });
    }

    const distance = calculateDistance(lat, lng, settings.officeLat, settings.officeLng);
    const isWithin = distance <= settings.allowedRadiusMeters;

    if (!isWithin) {
      return res.status(400).json({ 
        error: `Check-in failed! You are ${Math.round(distance)}m away from the office. Allowed radius is ${settings.allowedRadiusMeters}m.` 
      });
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date: today,
      checkInLocation: { lat, lng },
      isWithinRadius: true
    });

    res.status(201).json({ message: 'Checked in successfully!', attendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Attendance Records
exports.getAttendance = async (req, res) => {
  try {
    let query = {};
    // Agar user Employee hai toh sirf apni attendance dekhega, Admin/HR sab ki dekh sakenge
    if (req.user.role === 'Employee') {
      query.employee = req.user.id;
    }

    const records = await Attendance.find(query)
      .populate('employee', 'name email designation')
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};