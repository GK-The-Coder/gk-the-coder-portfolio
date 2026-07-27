import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

const FOLDERS = {
  achievements: { dir: path.join(process.cwd(), 'public', 'achievements'), urlPrefix: '/achievements' },
  certificates: { dir: path.join(process.cwd(), 'public', 'certificates'), urlPrefix: '/certificates' },
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function sanitizeFilename(name) {
  const ext = path.extname(name) || '.jpg'
  const base = path.basename(name, ext)
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  const timestamp = Date.now()
  return `${base || 'upload'}-${timestamp}${ext}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const folder = FOLDERS[req.query.folder] || FOLDERS.achievements
  ensureDir(folder.dir)

  const form = formidable({
    uploadDir: folder.dir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    filter: ({ mimetype }) => mimetype?.startsWith('image/'),
    filename: (_name, _ext, part) => sanitizeFilename(part.originalFilename || 'image'),
  })

  try {
    const [_fields, files] = await form.parse(req)
    const uploaded = files.file

    if (!uploaded || uploaded.length === 0) {
      return res.status(400).json({ error: 'No image file provided.' })
    }

    const results = uploaded.map((f) => ({
      url: `${folder.urlPrefix}/${path.basename(f.filepath)}`,
      size: f.size,
      mimetype: f.mimetype,
    }))

    return res.status(201).json(results.length === 1 ? results[0] : results)
  } catch (error) {
    console.error('Upload failed:', error.message)
    return res.status(500).json({ error: 'Failed to upload image.' })
  }
}
