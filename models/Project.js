const mongoose = require('mongoose')

const optionalWebUrl = {
  validator: (value) => !value || /^https?:\/\/[^\s]+$/i.test(value),
  message: 'Enter a valid http(s) URL.',
}

const optionalImageUrl = {
  validator: (value) => !value || value.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(value),
  message: 'Image must be an http(s) URL or a path beginning with /.',
}

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, trim: true, maxlength: 5000 },
  tags: [{ type: String, trim: true, maxlength: 40 }],
  link: { type: String, trim: true, validate: optionalWebUrl },
  repo: { type: String, trim: true, validate: optionalWebUrl },
  image: { type: String, trim: true, validate: optionalImageUrl },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema)
