const mongoose = require('mongoose')

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: String,
  content: String,
  tags: [String],
  published: { type: Boolean, default: false },
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.models.Blog || mongoose.model('Blog', BlogSchema)
