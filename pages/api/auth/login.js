const jwt = require('jsonwebtoken')

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { user, pass } = req.body
  if (!process.env.ADMIN_USER || !process.env.ADMIN_PASS || !process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Server not configured' })
  }
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${8 * 3600}; SameSite=Lax`)
    return res.status(200).json({ ok: true })
  }
  return res.status(401).json({ error: 'Invalid credentials' })
}
