import connect from '../../../lib/mongodb'
import Contact from '../../../models/Contact'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, isValidId, methodNotAllowed, sendApiError } from '../../../utils/api'

function contactPayload(body = {}) {
  return { type: cleanString(body.type), value: cleanString(body.value), link: cleanString(body.link) }
}

export default async function handler(req, res) {
  const allowed = ['GET', 'PUT', 'DELETE']
  if (!allowed.includes(req.method)) return methodNotAllowed(res, allowed)
  if (!isValidId(req.query.id)) return res.status(400).json({ error: 'Invalid contact id.' })
  if (req.method !== 'GET' && !requireAdmin(req, res)) return
  try {
    await connect()
    const { id } = req.query
    if (req.method === 'GET') {
      const item = await Contact.findById(id).lean()
      return item ? res.status(200).json(item) : res.status(404).json({ error: 'Contact method not found.' })
    }
    if (req.method === 'PUT') {
      const item = await Contact.findByIdAndUpdate(id, contactPayload(req.body), { new: true, runValidators: true })
      return item ? res.status(200).json(item) : res.status(404).json({ error: 'Contact method not found.' })
    }
    const item = await Contact.findByIdAndDelete(id)
    return item ? res.status(200).json({ ok: true }) : res.status(404).json({ error: 'Contact method not found.' })
  } catch (error) {
    return sendApiError(res, error, 'Unable to process the contact method.')
  }
}
