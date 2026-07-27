const mongoose = require('mongoose')

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  category: { type: String, trim: true, maxlength: 80 },
  level: { type: String, trim: true, maxlength: 40 },
  keywords: [{ type: String, trim: true, maxlength: 60 }],
}, { timestamps: true })

module.exports = mongoose.models.Skill || mongoose.model('Skill', SkillSchema)
