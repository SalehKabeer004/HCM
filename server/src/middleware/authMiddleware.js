// const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET || 'hcm_lite_super_secret_key';

// exports.verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Access denied. No token provided.' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded; // contains userId, role, email
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid or expired token.' });
//   }
// };

// exports.requireRole = (roles) => {
//   return (req, res, next) => {
//     if (!req.user || !roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Forbidden. You do not have permission for this action.' });
//     }
//     next();
//   };
// };

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Yahan hum ensure kar rahe hain ke req.user ke paas har surat ID mil jaye
    req.user = {
      ...decoded,
      id: decoded.id || decoded.userId || decoded._id
    };

    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden: Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole };