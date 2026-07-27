import connect from '../../../lib/mongodb'
import About from '../../../models/About'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, cleanStringArray, methodNotAllowed, sendApiError } from '../../../utils/api'

export default async function handler(req, res) {
  const allowed = ['GET', 'PUT']
  if (!allowed.includes(req.method)) return methodNotAllowed(res, allowed)
  if (req.method === 'PUT' && !requireAdmin(req, res)) return

  try {
    await connect()
    if (req.method === 'GET') {
      const about = await About.findOne({}).lean()
      return res.status(200).json(about || { headline: '', paragraphs: [] })
    }

    const data = {
      headline: cleanString(req.body?.headline) || 'About Me',
      paragraphs: cleanStringArray(req.body?.paragraphs),
    }
    const about = await About.findOneAndUpdate({}, data, {
      new: true,
      runValidators: true,
      upsert: true,
      setDefaultsOnInsert: true,
    })
    return res.status(200).json(about)
  } catch (error) {
    return sendApiError(res, error, 'Unable to process About content.')
  }
}
