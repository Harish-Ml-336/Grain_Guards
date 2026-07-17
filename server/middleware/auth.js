const jwt = require('jsonwebtoken');
const { getDb } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'grain-guards-secret-key-2026';

/**
 * Authenticate middleware – verifies Bearer token from Authorization header.
 * Attaches the full user object (without password_hash) to req.user.
 */
function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const db = getDb();
    const user = db.prepare(
      'SELECT id, name, email, role, avatar_url, created_at FROM users WHERE id = ?'
    ).get(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found. Token may be invalid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please login again.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    return res.status(401).json({ error: 'Authentication failed.' });
  }
}

/**
 * Authorize middleware factory – checks if the authenticated user's role
 * is among the allowed roles.
 * @param  {...string} roles - Allowed roles (e.g. 'admin', 'worker')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.',
        requiredRoles: roles,
        yourRole: req.user.role
      });
    }
    next();
  };
}

module.exports = { authenticate, authorize, JWT_SECRET };
