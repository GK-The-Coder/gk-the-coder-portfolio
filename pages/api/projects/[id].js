import connect from '../../../lib/mongodb'
import Project from '../../../models/Project'
import mongoose from 'mongoose'

export default async function handler(req, res) {
  await connect()
  const { id } = req.query
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' })
  if (req.method === 'GET') {
    const p = await Project.findById(id).lean()
    return res.json(p)
  }
  if (req.method === 'PUT') {
    try {
      const updated = await Project.findByIdAndUpdate(id, req.body, { new: true })
      return res.json(updated)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }
  if (req.method === 'DELETE') {
    await Project.findByIdAndDelete(id)
    return res.json({ ok: true })
  }
  res.status(405).end()
}
