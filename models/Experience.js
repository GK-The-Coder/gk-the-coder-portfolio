const mongoose = require('mongoose')

const ExperienceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  location: String,
  startDate: Date,
  endDate: Date,
  current: { type: Boolean, default: false },
  summary: String,
  highlights: [String],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema)
