import connect from '../../../lib/mongodb'
import Resume from '../../../models/Resume'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, methodNotAllowed, sendApiError } from '../../../utils/api'

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
  if (!['GET', 'POST'].includes(req.method)) return methodNotAllowed(res, ['GET', 'POST'])
  if (req.method === 'POST' && !requireAdmin(req, res)) return
  try {
    await connect()
    if (req.method === 'GET') {
      const items = await Resume.find({}).sort({ createdAt: -1 }).lean()
      return res.status(200).json(items)
    }
    const item = await Resume.create(resumePayload(req.body))
    return res.status(201).json(item)
  } catch (error) {
    return sendApiError(res, error, 'Unable to process resume entries.')
  }
}
