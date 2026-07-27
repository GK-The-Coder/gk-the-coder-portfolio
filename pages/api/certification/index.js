import connect from '../../../lib/mongodb'
import Certification from '../../../models/Certification'
import { requireAdmin } from '../../../utils/auth'

export default async function handler(req, res) {
  const { method } = req

  try {
    await connect()
  } catch (error) {
    return res.status(503).json({ error: 'Database unavailable.' })
  }

  if (method === 'GET') {
    try {
      const certifications = await Certification.find({}).sort({ date: -1, createdAt: -1 }).lean()
      return res.status(200).json(certifications)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch certifications.' })
    }
  }

  if (method === 'POST') {
    if (!requireAdmin(req, res)) return

    try {
      const { title, issuer, date, url, credentialId, image, description } = req.body
      if (!title) {
        return res.status(400).json({ error: 'Title is required.' })
      }

      const certification = await Certification.create({
        title: title.trim(),
        issuer: issuer?.trim() || '',
        date: date || null,
        url: url?.trim() || '',
        credentialId: credentialId?.trim() || '',
        image: image?.trim() || '',
        description: description?.trim() || '',
      })

      return res.status(201).json(certification)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create certification.' })
    }
  }

  return res.status(405).json({ error: `Method ${method} not allowed.` })
}
