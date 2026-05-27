import connect from '../../../lib/mongodb'
import Experience from '../../../models/Experience'

export default async function handler(req, res) {
  await connect()
  if (req.method === 'GET') {
    const items = await Experience.find({}).sort({ startDate: -1 }).lean()
    return res.json(items)
  }
  if (req.method === 'POST') {
    try {
      const body = { ...req.body }
      const parseDate = (v) => {
        if (!v && v !== 0) return undefined
        if (v instanceof Date) return v
        if (typeof v !== 'string') return undefined
        // dd/mm/yyyy or d/m/yyyy
        const dm = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
        if (dm) {
          const d = parseInt(dm[1], 10)
          const m = parseInt(dm[2], 10) - 1
          const y = parseInt(dm[3], 10)
          const dt = new Date(y, m, d)
          return isNaN(dt.getTime()) ? undefined : dt
        }
        // try ISO or other parseable formats
        const dt = new Date(v)
        return isNaN(dt.getTime()) ? undefined : dt
      }

      if ('startDate' in body) body.startDate = parseDate(body.startDate) || null
      if ('endDate' in body) body.endDate = parseDate(body.endDate) || null

      const p = new Experience(body)
      await p.save()
      return res.status(201).json(p)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }
  res.status(405).end()
}
