import connect from '../../../lib/mongodb'
import Skill from '../../../models/Skill'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, cleanStringArray, isValidId, methodNotAllowed, sendApiError } from '../../../utils/api'

function skillPayload(body = {}) {
  return {
    name: cleanString(body.name),
    category: cleanString(body.category),
    level: cleanString(body.level),
    keywords: cleanStringArray(body.keywords),
  }
}

export default async function handler(req, res) {
  const allowed = ['GET', 'PUT', 'DELETE']
  if (!allowed.includes(req.method)) return methodNotAllowed(res, allowed)
  if (!isValidId(req.query.id)) return res.status(400).json({ error: 'Invalid skill id.' })
  if (req.method !== 'GET' && !requireAdmin(req, res)) return
  try {
    await connect()
    const { id } = req.query
    if (req.method === 'GET') {
      const item = await Skill.findById(id).lean()
      return item ? res.status(200).json(item) : res.status(404).json({ error: 'Skill not found.' })
    }
    if (req.method === 'PUT') {
      const item = await Skill.findByIdAndUpdate(id, skillPayload(req.body), { new: true, runValidators: true })
      return item ? res.status(200).json(item) : res.status(404).json({ error: 'Skill not found.' })
    }
    const item = await Skill.findByIdAndDelete(id)
    return item ? res.status(200).json({ ok: true }) : res.status(404).json({ error: 'Skill not found.' })
  } catch (error) {
    return sendApiError(res, error, 'Unable to process the skill.')
  }
}
