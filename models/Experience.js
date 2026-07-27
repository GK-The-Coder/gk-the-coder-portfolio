const mongoose = require('mongoose')

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  company: { type: String, trim: true, maxlength: 120 },
  location: { type: String, trim: true, maxlength: 120 },
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },
  summary: { type: String, trim: true, maxlength: 5000 },
  highlights: [{ type: String, trim: true, maxlength: 300 }],
}, { timestamps: true })

module.exports = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema)
