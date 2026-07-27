import connect from '../../../lib/mongodb'
import Project from '../../../models/Project'
import { requireAdmin } from '../../../utils/auth'
import { cleanString, cleanStringArray, isValidId, methodNotAllowed, sendApiError } from '../../../utils/api'

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
  const allowed = ['GET', 'PUT', 'DELETE']
  if (!allowed.includes(req.method)) return methodNotAllowed(res, allowed)
  if (!isValidId(req.query.id)) return res.status(400).json({ error: 'Invalid project id.' })
  if (req.method !== 'GET' && !requireAdmin(req, res)) return

  try {
    await connect()
    const { id } = req.query

    if (req.method === 'GET') {
      const project = await Project.findById(id).lean()
      return project
        ? res.status(200).json(project)
        : res.status(404).json({ error: 'Project not found.' })
    }

    if (req.method === 'PUT') {
      const project = await Project.findByIdAndUpdate(id, projectPayload(req.body), {
        new: true,
        runValidators: true,
      })
      return project
        ? res.status(200).json(project)
        : res.status(404).json({ error: 'Project not found.' })
    }

    const project = await Project.findByIdAndDelete(id)
    return project
      ? res.status(200).json({ ok: true })
      : res.status(404).json({ error: 'Project not found.' })
  } catch (error) {
    return sendApiError(res, error, 'Unable to process the project.')
  }
}
