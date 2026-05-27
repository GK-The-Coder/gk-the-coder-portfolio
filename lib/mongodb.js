const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || ''

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connect() {
  if (!MONGODB_URI) {
    return null
  }
  if (cached.conn) {
    return cached.conn
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((m) => m)
      .catch((error) => {
        cached.promise = null
        throw error
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

module.exports = connect
