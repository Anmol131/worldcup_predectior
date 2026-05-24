const mongoose = require('mongoose');

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  await mongoose.connect(mongoUri);
  // Keep logs concise in production.
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}

module.exports = connectDB;
