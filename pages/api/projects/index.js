import connect from '../../../lib/mongodb'
import Project from '../../../models/Project'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, cleanStringArray, methodNotAllowed, sendApiError } from '../../../utils/api'

function projectPayload(body = {}) {
  return {
    title: cleanString(body.title),
    description: cleanString(body.description),
    tags: cleanStringArray(body.tags),
    link: cleanString(body.link),
    repo: cleanString(body.repo),
    image: cleanString(body.image),
    featured: body.featured === true,
  }
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return methodNotAllowed(res, ['GET', 'POST'])
  if (req.method === 'POST' && !requireAdmin(req, res)) return

  try {
    await connect()

    if (req.method === 'GET') {
      const items = await Project.find({}).sort({ createdAt: -1 }).lean()
      return res.status(200).json(items)
    }

    const project = await Project.create(projectPayload(req.body))
    return res.status(201).json(project)
  } catch (error) {
    return sendApiError(res, error, 'Unable to process projects.')
  }
}
