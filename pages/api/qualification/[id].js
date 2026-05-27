import connect from '../../../lib/mongodb'
import Qualification from '../../../models/Qualification'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  await connect()
  const { id } = req.query
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' })
  if (req.method === 'GET') {
    const item = await Qualification.findById(id).lean()
    return res.json(item)
  }
  if (req.method === 'PUT') {
    try {
      const updated = await Qualification.findByIdAndUpdate(id, req.body, { new: true })
      return res.json(updated)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }
  if (req.method === 'DELETE') {
    await Qualification.findByIdAndDelete(id)
    return res.json({ ok: true })
  }
  res.status(405).end()
}
