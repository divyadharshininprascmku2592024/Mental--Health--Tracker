const express = require('express');
const router = express.Router();
const {
  getSleepRecords,
  getSleepById,
  createSleepRecord,
  updateSleepRecord,
  deleteSleepRecord
} = require('../controllers/sleepController');

router.route('/')
  .get(getSleepRecords)
  .post(createSleepRecord);

router.route('/:id')
  .get(getSleepById)
  .put(updateSleepRecord)
  .delete(deleteSleepRecord);

module.exports = router;
