const mongoose = require('mongoose')

const ResumeSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  year: String,
  description: String,
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema)
