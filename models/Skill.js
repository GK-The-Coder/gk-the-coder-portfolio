const mongoose = require('mongoose')

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  level: String,
  keywords: [String],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Skill || mongoose.model('Skill', SkillSchema)
