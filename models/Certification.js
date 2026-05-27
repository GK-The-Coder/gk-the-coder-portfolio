const mongoose = require('mongoose')

const CertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: String,
  date: Date,
  url: String,
  credentialId: String,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Certification || mongoose.model('Certification', CertSchema)
