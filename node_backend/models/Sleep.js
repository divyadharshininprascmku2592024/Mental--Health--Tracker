const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'Date is required (YYYY-MM-DD)']
    },
    sleepTime: {
      type: String,
      required: [true, 'Sleep bedtime is required (HH:MM)']
    },
    wakeTime: {
      type: String,
      required: [true, 'Wake-up time is required (HH:MM)']
    },
    totalHours: {
      type: Number,
      required: [true, 'Total sleep hours is required'],
      min: 0,
      max: 24
    },
    quality: {
      type: String,
      enum: ['Poor', 'Average', 'Good', 'Excellent'],
      required: [true, 'Sleep quality is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Sleep', sleepSchema);
