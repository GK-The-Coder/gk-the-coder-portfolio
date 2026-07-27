import connect from '../../../lib/mongodb'
import Qualification from '../../../models/Qualification'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, methodNotAllowed, parseOptionalDate, sendApiError } from '../../../utils/api'

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
  if (!['GET', 'POST'].includes(req.method)) return methodNotAllowed(res, ['GET', 'POST'])
  if (req.method === 'POST' && !requireAdmin(req, res)) return
  try {
    await connect()
    if (req.method === 'GET') {
      const items = await Qualification.find({}).sort({ date: -1, createdAt: -1 }).lean()
      return res.status(200).json(items)
    }
    const item = await Qualification.create(qualificationPayload(req.body))
    return res.status(201).json(item)
  } catch (error) {
    return sendApiError(res, error, 'Unable to process qualifications.')
  }
}
