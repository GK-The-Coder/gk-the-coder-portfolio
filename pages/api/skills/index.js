import connect from '../../../lib/mongodb'
import Skill from '../../../models/Skill'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, cleanStringArray, methodNotAllowed, sendApiError } from '../../../utils/api'

function skillPayload(body = {}) {
  return {
    name: cleanString(body.name),
    category: cleanString(body.category),
    level: cleanString(body.level),
    keywords: cleanStringArray(body.keywords),
  }
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return methodNotAllowed(res, ['GET', 'POST'])
  if (req.method === 'POST' && !requireAdmin(req, res)) return
  try {
    await connect()
    if (req.method === 'GET') {
      const items = await Skill.find({}).sort({ createdAt: -1 }).lean()
      return res.status(200).json(items)
    }
    const item = await Skill.create(skillPayload(req.body))
    return res.status(201).json(item)
  } catch (error) {
    return sendApiError(res, error, 'Unable to process skills.')
  }
}
