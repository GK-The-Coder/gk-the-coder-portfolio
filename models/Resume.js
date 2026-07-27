const mongoose = require('mongoose')

const ResumeSchema = new mongoose.Schema({
  title: { type: String, trim: true, maxlength: 120 },
  subtitle: { type: String, trim: true, maxlength: 160 },
  year: { type: String, trim: true, maxlength: 20 },
  description: { type: String, trim: true, maxlength: 3000 },
  link: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => value.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(value),
      message: 'Resume link must be an http(s) URL or a path beginning with /.',
    },
  },
}, { timestamps: true })

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema)
