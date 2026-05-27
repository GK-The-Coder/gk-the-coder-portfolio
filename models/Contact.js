const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: String, required: true },
  link: String,
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
