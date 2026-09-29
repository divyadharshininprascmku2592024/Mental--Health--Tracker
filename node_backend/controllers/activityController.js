const Activity = require('../models/Activity');
const mongoose = require('mongoose');

let memoryActivities = [];

const getActivities = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const activities = await Activity.find().sort({ date: -1, createdAt: -1 });
      return res.json(activities);
    }
    res.json(memoryActivities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivityById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const activity = await Activity.findById(req.params.id);
      if (!activity) return res.status(404).json({ message: 'Activity record not found' });
      return res.json(activity);
    }
    const item = memoryActivities.find(a => a._id === req.params.id);
    if (!item) return res.status(404).json({ message: 'Activity record not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createActivity = async (req, res) => {
  try {
    const { date, activityName, category, duration, description } = req.body;
    if (!date || !activityName || !category || !duration) {
      return res.status(400).json({ message: 'Date, activityName, category, and duration are required.' });
    }
    if (mongoose.connection.readyState === 1) {
      const newActivity = await Activity.create({
        date,
        activityName,
        category,
        duration: Number(duration),
        description: description || ''
      });
      return res.status(201).json(newActivity);
    }
    const newActivity = {
      _id: new mongoose.Types.ObjectId().toString(),
      date,
      activityName,
      category,
      duration: Number(duration),
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryActivities.unshift(newActivity);
    res.status(201).json(newActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateActivity = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!updated) return res.status(404).json({ message: 'Activity record not found' });
      return res.json(updated);
    }
    const idx = memoryActivities.findIndex(a => a._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Activity record not found' });
    memoryActivities[idx] = { ...memoryActivities[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json(memoryActivities[idx]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const deleted = await Activity.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Activity record not found' });
      return res.json({ message: 'Activity record deleted successfully' });
    }
    const initialLen = memoryActivities.length;
    memoryActivities = memoryActivities.filter(a => a._id !== req.params.id);
    if (memoryActivities.length === initialLen) return res.status(404).json({ message: 'Activity record not found' });
    res.json({ message: 'Activity record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  _setMemoryStore: (data) => { memoryActivities = data; }
};
