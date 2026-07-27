import connect from '../../../lib/mongodb'
import Achievement from '../../../models/Achievement'
import { requireAdmin } from '../../../utils/auth'

export default async function handler(req, res) {
  const { method, query } = req
  const { id } = query

  try {
    await connect()
  } catch (error) {
    return res.status(503).json({ error: 'Database unavailable.' })
  }

  if (method === 'GET') {
    try {
      const achievement = await Achievement.findById(id).lean()
      if (!achievement) {
        return res.status(404).json({ error: 'Achievement not found.' })
      }
      return res.status(200).json(achievement)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch achievement.' })
    }
  }

  if (method === 'PUT') {
    if (!requireAdmin(req, res)) return

    try {
      const { title, description, category, date, images, link, organization } = req.body
      if (!title) {
        return res.status(400).json({ error: 'Title is required.' })
      }

      const achievement = await Achievement.findByIdAndUpdate(
        id,
        {
          title: title.trim(),
          description: description?.trim() || '',
          category: category?.trim() || '',
          date: date || null,
          images: Array.isArray(images) ? images.map(img => img.trim()).filter(Boolean) : [],
          link: link?.trim() || '',
          organization: organization?.trim() || '',
        },
        { new: true, runValidators: true }
      )

      if (!achievement) {
        return res.status(404).json({ error: 'Achievement not found.' })
      }

      return res.status(200).json(achievement)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update achievement.' })
    }
  }

  if (method === 'DELETE') {
    if (!requireAdmin(req, res)) return

    try {
      const achievement = await Achievement.findByIdAndDelete(id)
      if (!achievement) {
        return res.status(404).json({ error: 'Achievement not found.' })
      }
      return res.status(200).json({ message: 'Achievement deleted.' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete achievement.' })
    }
  }

  return res.status(405).json({ error: `Method ${method} not allowed.` })
}
