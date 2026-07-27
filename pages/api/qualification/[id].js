import connect from '../../../lib/mongodb'
import Qualification from '../../../models/Qualification'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, isValidId, methodNotAllowed, parseOptionalDate, sendApiError } from '../../../utils/api'

function qualificationPayload(body = {}) {
  return {
    title: cleanString(body.title),
    institution: cleanString(body.institution),
    date: parseOptionalDate(body.date),
    description: cleanString(body.description),
    url: cleanString(body.url),
  }
}

export default async function handler(req, res) {
  const allowed = ['GET', 'PUT', 'DELETE']
  if (!allowed.includes(req.method)) return methodNotAllowed(res, allowed)
  if (!isValidId(req.query.id)) return res.status(400).json({ error: 'Invalid qualification id.' })
  if (req.method !== 'GET' && !requireAdmin(req, res)) return
  try {
    await connect()
    const { id } = req.query
    if (req.method === 'GET') {
      const item = await Qualification.findById(id).lean()
      return item ? res.status(200).json(item) : res.status(404).json({ error: 'Qualification not found.' })
    }
    if (req.method === 'PUT') {
      const item = await Qualification.findByIdAndUpdate(id, qualificationPayload(req.body), { new: true, runValidators: true })
      return item ? res.status(200).json(item) : res.status(404).json({ error: 'Qualification not found.' })
    }
    const item = await Qualification.findByIdAndDelete(id)
    return item ? res.status(200).json({ ok: true }) : res.status(404).json({ error: 'Qualification not found.' })
  } catch (error) {
    return sendApiError(res, error, 'Unable to process the qualification.')
  }
}
