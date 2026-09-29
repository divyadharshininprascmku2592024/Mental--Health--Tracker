const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mental_health_db', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Node Backend] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Node Backend] MongoDB connection failed: ${error.message}`);
    console.warn('[Node Backend] Operating with fallback/in-memory database handlers for demonstration mode.');
  }
};

module.exports = connectDB;
