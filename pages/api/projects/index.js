import connect from '../../../lib/mongodb'
import Project from '../../../models/Project'

export default async function handler(req, res) {
  await connect()
  if (req.method === 'GET') {
    const items = await Project.find({}).sort({ createdAt: -1 }).lean()
    return res.json(items)
  }
  if (req.method === 'POST') {
    try {
      const p = new Project(req.body)
      await p.save()
      return res.status(201).json(p)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }
  res.status(405).end()
}
