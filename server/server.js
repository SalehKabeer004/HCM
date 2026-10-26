require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const orgRoutes = require('./src/routes/orgRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const leaveRoutes = require('./src/routes/leaveRoutes');

const app = express();

app.use(express.json());
// app.use(cors());

// CORS configuration for Vercel preview/production & Localhost
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://hcm-orpin-nu.vercel.app' // Aapka main frontend domain agar ho
];

app.use(cors({
  origin: function (origin, callback) {
    // Agar koi tool ya mobile app ho (no origin) ya agar domain .vercel.app se end hota ho
    if (!origin || origin.endsWith('.vercel.app') || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// OPTIONS preflight requests ke liye explicit handler
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes)
app.use('/api/leaves', leaveRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'HCM Lite backend is running smoothly!' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hcm-lite';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  }); 

  module.exports = app;