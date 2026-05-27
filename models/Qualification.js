const mongoose = require('mongoose')

const QualificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  institution: String,
  date: String,
  description: String,
  url: String,
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.models.Qualification || mongoose.model('Qualification', QualificationSchema)
