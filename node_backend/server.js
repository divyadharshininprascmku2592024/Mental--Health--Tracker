const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = require('./config/db');
const moodRoutes = require('./routes/moodRoutes');
const journalRoutes = require('./routes/journalRoutes');
const sleepRoutes = require('./routes/sleepRoutes');
const activityRoutes = require('./routes/activityRoutes');

const moodCtrl = require('./controllers/moodController');
const journalCtrl = require('./controllers/journalController');
const sleepCtrl = require('./controllers/sleepController');
const activityCtrl = require('./controllers/activityController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Populate initial seed data into memory/DB if empty
const loadSeedData = () => {
  try {
    const seedPath = path.join(__dirname, '..', 'seed_data.json');
    if (fs.existsSync(seedPath)) {
      const data = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      const formatWithIds = (arr) => arr.map((item, idx) => ({
        ...item,
        _id: item._id || new mongoose.Types.ObjectId().toString(),
        createdAt: item.createdAt || new Date(Date.now() - idx * 86400000).toISOString(),
        updatedAt: item.updatedAt || new Date(Date.now() - idx * 86400000).toISOString()
      }));
      moodCtrl._setMemoryStore(formatWithIds(data.moods || []));
      journalCtrl._setMemoryStore(formatWithIds(data.journals || []));
      sleepCtrl._setMemoryStore(formatWithIds(data.sleep || []));
      activityCtrl._setMemoryStore(formatWithIds(data.activities || []));
      console.log('[Node Backend] Loaded seed dataset into active store.');
    }
  } catch (err) {
    console.error('[Node Backend] Error loading seed dataset:', err.message);
  }
};
loadSeedData();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Node.js Express Mental Health Backend',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'in-memory/standby'
  });
});

// API Routes
app.use('/api/moods', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/activities', activityRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Node Backend] Server running on port ${PORT}`);
});
