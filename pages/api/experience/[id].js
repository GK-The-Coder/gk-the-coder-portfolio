import connect from '../../../lib/mongodb'
import Experience from '../../../models/Experience'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, cleanStringArray, isValidId, methodNotAllowed, parseOptionalDate, sendApiError } from '../../../utils/api'

function experiencePayload(body = {}) {
  const current = body.current === true
  return {
    title: cleanString(body.title),
    company: cleanString(body.company),
    location: cleanString(body.location),
    startDate: parseOptionalDate(body.startDate),
    endDate: current ? null : parseOptionalDate(body.endDate),
    current,
    summary: cleanString(body.summary),
    highlights: cleanStringArray(body.highlights),
  }
}

export default async function handler(req, res) {
  const allowed = ['GET', 'PUT', 'DELETE']
  if (!allowed.includes(req.method)) return methodNotAllowed(res, allowed)
  if (!isValidId(req.query.id)) return res.status(400).json({ error: 'Invalid experience id.' })
  if (req.method !== 'GET' && !requireAdmin(req, res)) return

  try {
    await connect()
    const { id } = req.query

    if (req.method === 'GET') {
      const experience = await Experience.findById(id).lean()
      return experience
        ? res.status(200).json(experience)
        : res.status(404).json({ error: 'Experience not found.' })
    }

    if (req.method === 'PUT') {
      const experience = await Experience.findByIdAndUpdate(id, experiencePayload(req.body), {
        new: true,
        runValidators: true,
      })
      return experience
        ? res.status(200).json(experience)
        : res.status(404).json({ error: 'Experience not found.' })
    }

    const experience = await Experience.findByIdAndDelete(id)
    return experience
      ? res.status(200).json({ ok: true })
      : res.status(404).json({ error: 'Experience not found.' })
  } catch (error) {
    return sendApiError(res, error, 'Unable to process the experience entry.')
  }
}
