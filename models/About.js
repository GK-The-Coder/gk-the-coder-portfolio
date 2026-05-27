const mongoose = require('mongoose')

const AboutSchema = new mongoose.Schema({
  headline: { type: String, default: 'About Me' },
  paragraphs: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.models.About || mongoose.model('About', AboutSchema)
