const Mood = require('../models/Mood');
const mongoose = require('mongoose');

// In-memory store fallback if MongoDB server is offline during initial startup
let memoryMoods = [];

const getMoods = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const moods = await Mood.find().sort({ date: -1, createdAt: -1 });
      return res.json(moods);
    }
    res.json(memoryMoods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMoodById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const mood = await Mood.findById(req.params.id);
      if (!mood) return res.status(404).json({ message: 'Mood record not found' });
      return res.json(mood);
    }
    const item = memoryMoods.find(m => m._id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Mood record not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMood = async (req, res) => {
  try {
    const { date, mood, moodRating, stressLevel, anxietyLevel, note } = req.body;
    if (!date || !mood || !moodRating || !stressLevel || !anxietyLevel) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }
    if (mongoose.connection.readyState === 1) {
      const newMood = await Mood.create({
        date,
        mood,
        moodRating: Number(moodRating),
        stressLevel: Number(stressLevel),
        anxietyLevel: Number(anxietyLevel),
        note: note || ''
      });
      return res.status(201).json(newMood);
    }
    const newMood = {
      _id: new mongoose.Types.ObjectId().toString(),
      date,
      mood,
      moodRating: Number(moodRating),
      stressLevel: Number(stressLevel),
      anxietyLevel: Number(anxietyLevel),
      note: note || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryMoods.unshift(newMood);
    res.status(201).json(newMood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMood = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await Mood.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: 'Mood record not found' });
      return res.json(updated);
    }
    const idx = memoryMoods.findIndex(m => m._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Mood record not found' });
    memoryMoods[idx] = { ...memoryMoods[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json(memoryMoods[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMood = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deleted = await Mood.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Mood record not found' });
      return res.json({ message: 'Mood record deleted successfully' });
    }
    const initialLen = memoryMoods.length;
    memoryMoods = memoryMoods.filter(m => m._id !== req.params.id);
    if (memoryMoods.length === initialLen) return res.status(404).json({ message: 'Mood record not found' });
    res.json({ message: 'Mood record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMoods,
  getMoodById,
  createMood,
  updateMood,
  deleteMood,
  _setMemoryStore: (data) => { memoryMoods = data; }
};
