const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const Mood = require('./models/Mood');
const Journal = require('./models/Journal');
const Sleep = require('./models/Sleep');
const Activity = require('./models/Activity');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mental_health_db';
    console.log(`Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database collections...');
    await Mood.deleteMany({});
    await Journal.deleteMany({});
    await Sleep.deleteMany({});
    await Activity.deleteMany({});

    const seedPath = path.join(__dirname, '..', 'seed_data.json');
    const rawData = fs.readFileSync(seedPath, 'utf8');
    const data = JSON.parse(rawData);

    await Mood.insertMany(data.moods);
    await Journal.insertMany(data.journals);
    await Sleep.insertMany(data.sleep);
    await Activity.insertMany(data.activities);

    console.log(' Successfully seeded MongoDB database!');
    console.log(`Inserted ${data.moods.length} moods, ${data.journals.length} journals, ${data.sleep.length} sleep logs, ${data.activities.length} activities.`);
    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
