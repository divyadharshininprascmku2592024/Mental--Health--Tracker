const express = require("express");
const Mood = require("../models/Mood");

const router = express.Router();

// Add mood
router.post("/", async (req, res) => {
  try {
    const mood = new Mood(req.body);
    const savedMood = await mood.save();

    res.status(201).json(savedMood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get moods
router.get("/", async (req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;