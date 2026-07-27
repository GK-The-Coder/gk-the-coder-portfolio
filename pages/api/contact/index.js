import connect from '../../../lib/mongodb'
import Contact from '../../../models/Contact'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, methodNotAllowed, sendApiError } from '../../../utils/api'

function contactPayload(body = {}) {
  return { type: cleanString(body.type), value: cleanString(body.value), link: cleanString(body.link) }
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return methodNotAllowed(res, ['GET', 'POST'])
  if (req.method === 'POST' && !requireAdmin(req, res)) return
  try {
    await connect()
    if (req.method === 'GET') {
      const items = await Contact.find({}).sort({ createdAt: -1 }).lean()
      return res.status(200).json(items)
    }
    const item = await Contact.create(contactPayload(req.body))
    return res.status(201).json(item)
  } catch (error) {
    return sendApiError(res, error, 'Unable to process contact methods.')
  }
}
