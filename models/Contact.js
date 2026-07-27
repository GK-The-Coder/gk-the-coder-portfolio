const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true, maxlength: 60 },
  value: { type: String, required: true, trim: true, maxlength: 200 },
  link: {
    type: String,
    trim: true,
    validate: {
      validator: (value) => !value || /^(https?:\/\/|mailto:|tel:)[^\s]+$/i.test(value),
      message: 'Contact link must use http(s), mailto, or tel.',
    },
  },
}, { timestamps: true })

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
