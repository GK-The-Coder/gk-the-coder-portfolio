import connect from '../../../lib/mongodb'
import Certification from '../../../models/Certification'
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
      const certification = await Certification.findById(id).lean()
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found.' })
      }
      return res.status(200).json(certification)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch certification.' })
    }
  }

  if (method === 'PUT') {
    if (!requireAdmin(req, res)) return

    try {
      const { title, issuer, date, url, credentialId, image, description } = req.body
      if (!title) {
        return res.status(400).json({ error: 'Title is required.' })
      }

      const certification = await Certification.findByIdAndUpdate(
        id,
        {
          title: title.trim(),
          issuer: issuer?.trim() || '',
          date: date || null,
          url: url?.trim() || '',
          credentialId: credentialId?.trim() || '',
          image: image?.trim() || '',
          description: description?.trim() || '',
        },
        { new: true, runValidators: true }
      )

      if (!certification) {
        return res.status(404).json({ error: 'Certification not found.' })
      }

      return res.status(200).json(certification)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update certification.' })
    }
  }

  if (method === 'DELETE') {
    if (!requireAdmin(req, res)) return

    try {
      const certification = await Certification.findByIdAndDelete(id)
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found.' })
      }
      return res.status(200).json({ message: 'Certification deleted.' })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete certification.' })
    }
  }

  return res.status(405).json({ error: `Method ${method} not allowed.` })
}
