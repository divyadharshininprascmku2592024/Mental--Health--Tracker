const Journal = require('../models/Journal');
const mongoose = require('mongoose');

let memoryJournals = [];

const getJournals = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const journals = await Journal.find().sort({ date: -1, createdAt: -1 });
      return res.json(journals);
    }
    res.json(memoryJournals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJournalById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const journal = await Journal.findById(req.params.id);
      if (!journal) return res.status(404).json({ message: 'Journal entry not found' });
      return res.json(journal);
    }
    const item = memoryJournals.find(j => j._id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Journal entry not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createJournal = async (req, res) => {
  try {
    const { date, title, content, mood } = req.body;
    if (!date || !title || !content || !mood) {
      return res.status(400).json({ message: 'All journal fields (date, title, content, mood) are required.' });
    }
    if (mongoose.connection.readyState === 1) {
      const newJournal = await Journal.create({ date, title, content, mood });
      return res.status(201).json(newJournal);
    }
    const newJournal = {
      _id: new mongoose.Types.ObjectId().toString(),
      date,
      title,
      content,
      mood,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryJournals.unshift(newJournal);
    res.status(201).json(newJournal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateJournal = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: 'Journal entry not found' });
      return res.json(updated);
    }
    const idx = memoryJournals.findIndex(j => j._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Journal entry not found' });
    memoryJournals[idx] = { ...memoryJournals[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json(memoryJournals[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteJournal = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deleted = await Journal.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Journal entry not found' });
      return res.json({ message: 'Journal entry deleted successfully' });
    }
    const initialLen = memoryJournals.length;
    memoryJournals = memoryJournals.filter(j => j._id !== req.params.id);
    if (memoryJournals.length === initialLen) return res.status(404).json({ message: 'Journal entry not found' });
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  _setMemoryStore: (data) => { memoryJournals = data; }
};
