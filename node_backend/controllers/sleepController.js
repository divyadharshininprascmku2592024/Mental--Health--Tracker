const Sleep = require('../models/Sleep');
const mongoose = require('mongoose');

let memorySleep = [];

const getSleepRecords = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const records = await Sleep.find().sort({ date: -1, createdAt: -1 });
      return res.json(records);
    }
    res.json(memorySleep);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSleepById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const record = await Sleep.findById(req.params.id);
      if (!record) return res.status(404).json({ message: 'Sleep record not found' });
      return res.json(record);
    }
    const item = memorySleep.find(s => s._id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Sleep record not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSleepRecord = async (req, res) => {
  try {
    const { date, sleepTime, wakeTime, totalHours, quality } = req.body;
    if (!date || !sleepTime || !wakeTime || totalHours === undefined || !quality) {
      return res.status(400).json({ message: 'All sleep fields are required.' });
    }
    if (mongoose.connection.readyState === 1) {
      const newRecord = await Sleep.create({
        date,
        sleepTime,
        wakeTime,
        totalHours: Number(totalHours),
        quality
      });
      return res.status(201).json(newRecord);
    }
    const newRecord = {
      _id: new mongoose.Types.ObjectId().toString(),
      date,
      sleepTime,
      wakeTime,
      totalHours: Number(totalHours),
      quality,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memorySleep.unshift(newRecord);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSleepRecord = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await Sleep.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: 'Sleep record not found' });
      return res.json(updated);
    }
    const idx = memorySleep.findIndex(s => s._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Sleep record not found' });
    memorySleep[idx] = { ...memorySleep[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json(memorySleep[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSleepRecord = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deleted = await Sleep.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Sleep record not found' });
      return res.json({ message: 'Sleep record deleted successfully' });
    }
    const initialLen = memorySleep.length;
    memorySleep = memorySleep.filter(s => s._id !== req.params.id);
    if (memorySleep.length === initialLen) return res.status(404).json({ message: 'Sleep record not found' });
    res.json({ message: 'Sleep record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSleepRecords,
  getSleepById,
  createSleepRecord,
  updateSleepRecord,
  deleteSleepRecord,
  _setMemoryStore: (data) => { memorySleep = data; }
};
