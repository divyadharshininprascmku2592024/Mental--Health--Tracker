const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'Date is required (YYYY-MM-DD)']
    },
    mood: {
      type: String,
      enum: ['Very Happy', 'Happy', 'Neutral', 'Sad', 'Very Sad'],
      required: [true, 'Mood option is required']
    },
    moodRating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Mood rating (1-10) is required']
    },
    stressLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Stress level (1-10) is required']
    },
    anxietyLevel: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, 'Anxiety level (1-10) is required']
    },
    note: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Mood', moodSchema);
