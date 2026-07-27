const mongoose = require('mongoose')

function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed)
  return res.status(405).json({ error: `Method not allowed. Use ${allowed.join(', ')}.` })
}

function sendApiError(res, error, fallbackMessage = 'Request failed.') {
  console.error(fallbackMessage, error)

  if (error?.name === 'ValidationError' || error?.name === 'CastError') {
    return res.status(400).json({ error: error.message })
  }

  return res.status(500).json({ error: fallbackMessage })
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id)
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function cleanStringArray(value) {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []
  return [...new Set(items.map(cleanString).filter(Boolean))]
}

function parseOptionalDate(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

module.exports = {
  cleanString,
  cleanStringArray,
  isValidId,
  methodNotAllowed,
  parseOptionalDate,
  sendApiError,
}
