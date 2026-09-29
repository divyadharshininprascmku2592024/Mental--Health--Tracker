const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'Date is required (YYYY-MM-DD)']
    },
    activityName: {
      type: String,
      required: [true, 'Activity name is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Exercise', 'Meditation', 'Walking', 'Reading', 'Yoga', 'Hobby', 'Other'],
      required: [true, 'Category is required']
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: 1
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Activity', activitySchema);
