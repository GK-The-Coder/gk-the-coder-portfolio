const jwt = require('jsonwebtoken')

function verifyToken(token) {
  if (!token || !process.env.JWT_SECRET) return null

  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return null
  }
}

function getRequestToken(req) {
  if (req.cookies?.token) return req.cookies.token

  const cookie = req.headers?.cookie || ''
  const tokenCookie = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('token='))

  return tokenCookie ? decodeURIComponent(tokenCookie.slice('token='.length)) : null
}

function requireAdmin(req, res) {
  const session = verifyToken(getRequestToken(req))
  if (session) return session

  res.status(401).json({ error: 'Authentication required.' })
  return null
}

module.exports = { getRequestToken, requireAdmin, verifyToken }
