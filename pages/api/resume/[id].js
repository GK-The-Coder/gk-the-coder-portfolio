import connect from '../../../lib/mongodb'
import Resume from '../../../models/Resume'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, isValidId, methodNotAllowed, sendApiError } from '../../../utils/api'

function resumePayload(body = {}) {
  return {
    title: cleanString(body.title),
    subtitle: cleanString(body.subtitle),
    year: cleanString(body.year),
    description: cleanString(body.description),
    link: cleanString(body.link),
  }
}

export default async function handler(req, res) {
  const allowed = ['GET', 'PUT', 'DELETE']
  if (!allowed.includes(req.method)) return methodNotAllowed(res, allowed)
  if (!isValidId(req.query.id)) return res.status(400).json({ error: 'Invalid resume id.' })
  if (req.method !== 'GET' && !requireAdmin(req, res)) return
  try {
    await connect()
    const { id } = req.query
    if (req.method === 'GET') {
      const item = await Resume.findById(id).lean()
      return item ? res.status(200).json(item) : res.status(404).json({ error: 'Resume entry not found.' })
    }
    if (req.method === 'PUT') {
      const item = await Resume.findByIdAndUpdate(id, resumePayload(req.body), { new: true, runValidators: true })
      return item ? res.status(200).json(item) : res.status(404).json({ error: 'Resume entry not found.' })
    }
    const item = await Resume.findByIdAndDelete(id)
    return item ? res.status(200).json({ ok: true }) : res.status(404).json({ error: 'Resume entry not found.' })
  } catch (error) {
    return sendApiError(res, error, 'Unable to process the resume entry.')
  }
}
