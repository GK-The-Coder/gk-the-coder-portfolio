const mongoose = require('mongoose')

const QualificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  institution: { type: String, trim: true, maxlength: 160 },
  date: Date,
  description: { type: String, trim: true, maxlength: 3000 },
  url: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => !value || /^https?:\/\/[^\s]+$/i.test(value),
      message: 'Enter a valid qualification URL.',
    },
  },
}, { timestamps: true })

module.exports = mongoose.models.Qualification || mongoose.model('Qualification', QualificationSchema)
