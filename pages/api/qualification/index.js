import connect from '../../../lib/mongodb'
import Qualification from '../../../models/Qualification'

export default async function handler(req, res) {
  await connect()
  if (req.method === 'GET') {
    const items = await Qualification.find({}).sort({ date: -1, createdAt: -1 }).lean()
    return res.json(items)
  }
  if (req.method === 'POST') {
    try {
      const item = new Qualification(req.body)
      await item.save()
      return res.status(201).json(item)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }
  res.status(405).end()
}
