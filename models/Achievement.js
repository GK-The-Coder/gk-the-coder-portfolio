const mongoose = require('mongoose')

const optionalWebUrl = {
  validator: (value) => !value || /^https?:\/\/[^\s]+$/i.test(value),
  message: 'Enter a valid http(s) URL.',
}

const optionalImageUrl = {
  validator: (value) => !value || value.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(value),
  message: 'Image must be an http(s) URL or a path beginning with /.',
}

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000 },
  category: { type: String, trim: true, maxlength: 50 },
  date: Date,
  images: [{ type: String, trim: true, validate: optionalImageUrl }],
  link: { type: String, trim: true, validate: optionalWebUrl },
  organization: { type: String, trim: true, maxlength: 100 },
}, { timestamps: true })

module.exports = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema)
