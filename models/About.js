const mongoose = require('mongoose')

const AboutSchema = new mongoose.Schema({
  headline: { type: String, trim: true, maxlength: 160, default: 'About Me' },
  paragraphs: [{ type: String, trim: true, maxlength: 5000 }],
}, { timestamps: true })

module.exports = mongoose.models.About || mongoose.model('About', AboutSchema)
