import connect from '../../../lib/mongodb'
import Experience from '../../../models/Experience'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, cleanStringArray, methodNotAllowed, parseOptionalDate, sendApiError } from '../../../utils/api'

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
  if (!['GET', 'POST'].includes(req.method)) return methodNotAllowed(res, ['GET', 'POST'])
  if (req.method === 'POST' && !requireAdmin(req, res)) return

  try {
    await connect()
    if (req.method === 'GET') {
      const items = await Experience.find({}).sort({ startDate: -1 }).lean()
      return res.status(200).json(items)
    }

    const experience = await Experience.create(experiencePayload(req.body))
    return res.status(201).json(experience)
  } catch (error) {
    return sendApiError(res, error, 'Unable to process experience entries.')
  }
}
