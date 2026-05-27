import connect from '../../../lib/mongodb'
import About from '../../../models/About'

export default async function handler(req, res) {
  await connect()
  if (req.method === 'GET') {
    const about = await About.findOne({}).lean()
    return res.json(about || { headline: '', paragraphs: [] })
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const { headline, paragraphs } = req.body
      const normalizedParagraphs = Array.isArray(paragraphs)
        ? paragraphs
        : typeof paragraphs === 'string'
        ? paragraphs.split(/\r?\n\s*\n/).map((line) => line.trim()).filter(Boolean)
        : []
      let about = await About.findOne({})
      const data = {
        headline: headline || 'About Me',
        paragraphs: normalizedParagraphs,
        updatedAt: new Date(),
      }
      if (about) {
        Object.assign(about, data)
        await about.save()
      } else {
        about = await About.create(data)
      }
      return res.json(about)
    } catch (e) {
      return res.status(400).json({ error: e.message })
    }
  }

  res.status(405).end()
}
