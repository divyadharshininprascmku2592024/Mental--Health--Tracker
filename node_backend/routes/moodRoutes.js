const express = require('express');
const router = express.Router();
const {
  getMoods,
  getMoodById,
  createMood,
  updateMood,
  deleteMood
} = require('../controllers/moodController');

router.route('/')
  .get(getMoods)
  .post(createMood);

router.route('/:id')
  .get(getMoodById)
  .put(updateMood)
  .delete(deleteMood);

module.exports = router;
