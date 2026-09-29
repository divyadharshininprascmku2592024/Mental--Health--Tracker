const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'Date is required (YYYY-MM-DD)']
    },
    title: {
      type: String,
      required: [true, 'Journal title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Journal content is required']
    },
    mood: {
      type: String,
      required: [true, 'Associated mood is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Journal', journalSchema);
