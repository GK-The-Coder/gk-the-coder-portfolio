import connect from '../../../lib/mongodb'
import Experience from '../../../models/Experience'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  await connect()
  const { id } = req.query
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' })
  if (req.method === 'GET') {
    const p = await Experience.findById(id).lean()
    return res.json(p)
  }
  if (req.method === 'PUT') {
    try {
      const body = { ...req.body }
      const parseDate = (v) => {
        if (!v && v !== 0) return undefined
        if (v instanceof Date) return v
        if (typeof v !== 'string') return undefined
        const dm = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
        if (dm) {
          const d = parseInt(dm[1], 10)
          const m = parseInt(dm[2], 10) - 1
          const y = parseInt(dm[3], 10)
          const dt = new Date(y, m, d)
          return isNaN(dt.getTime()) ? undefined : dt
        }
        const dt = new Date(v)
        return isNaN(dt.getTime()) ? undefined : dt
      }
      if ('startDate' in body) body.startDate = parseDate(body.startDate) || null
      if ('endDate' in body) body.endDate = parseDate(body.endDate) || null

      const updated = await Experience.findByIdAndUpdate(id, body, { new: true })
      return res.json(updated)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }
  if (req.method === 'DELETE') {
    await Experience.findByIdAndDelete(id)
    return res.json({ ok: true })
  }
  res.status(405).end()
}
