import connect from '../../../lib/mongodb'
import Contact from '../../../models/Contact'

export default async function handler(req, res) {
  await connect()
  if (req.method === 'GET') {
    const items = await Contact.find({}).sort({ createdAt: -1 }).lean()
    return res.json(items)
  }
  if (req.method === 'POST') {
    try {
      const item = new Contact(req.body)
      await item.save()
      return res.status(201).json(item)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }
  res.status(405).end()
}
