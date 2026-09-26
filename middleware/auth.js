const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Verifies the JWT sent in the Authorization header
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findByPk(decoded.userId)
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' })
    }

    req.user = user // attach the logged-in user to the request for later use
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

// Restricts a route to admin-role users only — use AFTER verifyToken
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  next()
}

module.exports = { verifyToken, requireAdmin }