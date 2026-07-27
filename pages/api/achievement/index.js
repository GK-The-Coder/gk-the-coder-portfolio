import connect from '../../../lib/mongodb'
import Achievement from '../../../models/Achievement'
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
      const achievements = await Achievement.find({}).sort({ date: -1, createdAt: -1 }).lean()
      return res.status(200).json(achievements)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch achievements.' })
    }
  }

  if (method === 'POST') {
    if (!requireAdmin(req, res)) return

    try {
      const { title, description, category, date, images, link, organization } = req.body
      if (!title) {
        return res.status(400).json({ error: 'Title is required.' })
      }

      const achievement = await Achievement.create({
        title: title.trim(),
        description: description?.trim() || '',
        category: category?.trim() || '',
        date: date || null,
        images: Array.isArray(images) ? images.map(img => img.trim()).filter(Boolean) : [],
        link: link?.trim() || '',
        organization: organization?.trim() || '',
      })

      return res.status(201).json(achievement)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create achievement.' })
    }
  }

  return res.status(405).json({ error: `Method ${method} not allowed.` })
}
