const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  tags: [String],
  link: String,
  repo: String,
  image: String,
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema)
