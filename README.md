# Mental Health Tracker and Wellness Monitoring System

A full-stack mental health and daily wellness monitoring web application designed for a **college final-year undergraduate project**.

> [!IMPORTANT]
> **No Authentication**: Per project requirements, this application is designed for direct accessibility without login, registration, password management, or JWT tokens.
> **Educational & Wellness Disclaimer**: This system is designed solely for educational and personal general wellness tracking. It is NOT intended for clinical medical diagnosis, disease prediction, or mental health treatment.

---

## 1. Project Overview

The **Mental Health Tracker and Wellness Monitoring System** allows users to record, monitor, and reflect on their daily mental health. The application provides interactive tools to track daily mood ratings, stress levels, anxiety scores, sleep schedules, physical/mental activities, and daily reflection journals.

### Key Objectives
- **Daily Mood & Emotion Tracking**: Log mood categories, 1-10 intensity sliders, stress levels, and personal notes.
- **Thought Reflection Journal**: Write daily journal entries categorized by mood with search and date filters.
- **Sleep & Activity Monitoring**: Record bedtime schedules, sleep quality, and daily physical or mindfulness habits.
- **Graphical Analytics & Reports**: Visualize health trends across 6 distinct interactive charts (Recharts).
- **Personalized Wellness Suggestions**: Receive dynamic health suggestions and general wellness scores based on input metrics.

---

## 2. Technology Stack

### Frontend
- **React.js** (Vite build tool)
- **HTML5 & CSS3** (Custom modern CSS tokens, dark theme gradients, glassmorphism UI)
- **JavaScript (ES6+)** & **React Hooks**
- **Axios** (Centralized API communication client with live backend switching)
- **React Router v6** (Client-side routing)
- **Recharts** (Interactive data visualization graphs)
- **Lucide React** (Modern iconography)

### Backend Services (Dual Backend Architecture)
1. **Django + Django REST Framework (DRF)**: Main REST API server running on port `8000`.
2. **Node.js + Express.js**: Secondary REST API server running on port `5000`.

### Database
- **MongoDB**: Storage engine utilizing `mental_health_db`.
- **Mongoose**: Object Data Modeling (ODM) for Node.js backend.
- **PyMongo**: MongoDB driver integration for Django backend.

---

## 3. System Architecture

```text
+-------------------------------------------------------------------------+
|                           React Frontend (Vite)                         |
|                             (Port 3000)                                 |
+------------------------------------+------------------------------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v                                             v
+---------------------------+                 +---------------------------+
|   Django REST Backend     |                 |    Node.js Express API    |
|        (Port 8000)        |                 |        (Port 5000)        |
+-------------+-------------+                 +-------------+-------------+
              |                                             |
              +----------------------+----------------------+
                                     |
                                     v
                        +---------------------------+
                        |      MongoDB Database     |
                        |     (mental_health_db)    |
                        +---------------------------+
```

---

## 4. Folder Structure

```text
mental_health_tracker/
│
├── seed_data.json                 # Shared seed dataset (10 moods, 10 sleep, 10 activities, 5 journals)
├── README.md                      # Full UG project documentation
│
├── django_backend/                # Django REST Framework Backend
│   ├── manage.py                  # Django administrative script
│   ├── requirements.txt           # Python dependencies
│   ├── seed.py                    # Standalone PyMongo seed script
│   ├── config/
│   │   ├── settings.py            # Settings with CORS and Mongo URI
│   │   ├── urls.py                # Primary URL router
│   │   └── wsgi.py                # WSGI entrypoint
│   └── api/
│       ├── db.py                  # PyMongo helper & memory store fallback
│       ├── serializers.py         # DRF Serializers
│       ├── views.py               # REST API Views
│       └── urls.py                # API routes (/api/moods/, etc.)
│
├── node_backend/                  # Node.js + Express + Mongoose Backend
│   ├── server.js                  # Main Express server entrypoint
│   ├── package.json               # Node package manifest
│   ├── seed.js                    # Standalone Mongoose seed script
│   ├── .env                       # Environment variables
│   ├── config/
│   │   └── db.js                  # Mongoose MongoDB connection
│   ├── models/
│   │   ├── Mood.js                # Mood schema
│   │   ├── Journal.js             # Journal schema
│   │   ├── Sleep.js               # Sleep schema
│   │   └── Activity.js            # Activity schema
│   ├── routes/
│   │   ├── moodRoutes.js
│   │   ├── journalRoutes.js
│   │   ├── sleepRoutes.js
│   │   └── activityRoutes.js
│   └── controllers/
│       ├── moodController.js
│       ├── journalController.js
│       ├── sleepController.js
│       └── activityController.js
│
└── frontend/                      # React Frontend App
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css              # Custom theme system & glassmorphism styles
        ├── services/
        │   └── api.js             # Centralized Axios client & backend switcher
        ├── components/
        │   ├── Navbar.jsx         # Header bar with live backend switcher
        │   ├── Sidebar.jsx        # Navigation sidebar & drawer
        │   ├── StatCard.jsx       # Summary metric cards
        │   ├── MoodChart.jsx      # Recharts weekly mood trend
        │   ├── StressChart.jsx    # Recharts weekly stress trend
        │   ├── SleepChart.jsx     # Recharts sleep duration trend
        │   ├── AnxietyChart.jsx   # Recharts weekly anxiety trend
        │   ├── ActivityChart.jsx  # Recharts activity duration chart
        │   └── MoodDistributionChart.jsx # Recharts mood pie chart
        └── pages/
            ├── Dashboard.jsx      # Module 1: Dashboard
            ├── MoodTracker.jsx    # Module 2: Mood Tracker
            ├── Journal.jsx        # Module 3: Reflection Journal
            ├── SleepTracker.jsx   # Module 4: Sleep Tracker
            ├── Activities.jsx     # Module 4: Activity Tracker
            └── Reports.jsx        # Module 5: Analytics & Suggestions
```

---

## 5. Database Schema (MongoDB Collections)

### Collection: `moods`
```json
{
  "_id": "ObjectId",
  "date": "2026-08-08",
  "mood": "Very Happy",
  "moodRating": 9,
  "stressLevel": 2,
  "anxietyLevel": 2,
  "note": "Great progress on project build!",
  "createdAt": "2026-08-08T10:00:00.000Z",
  "updatedAt": "2026-08-08T10:00:00.000Z"
}
```

### Collection: `journals`
```json
{
  "_id": "ObjectId",
  "date": "2026-08-08",
  "title": "Gratitude & Looking Forward",
  "content": "Grateful for supportive mentors and friends.",
  "mood": "Very Happy",
  "createdAt": "2026-08-08T10:00:00.000Z",
  "updatedAt": "2026-08-08T10:00:00.000Z"
}
```

### Collection: `sleep`
```json
{
  "_id": "ObjectId",
  "date": "2026-08-08",
  "sleepTime": "22:00",
  "wakeTime": "07:00",
  "totalHours": 9.0,
  "quality": "Excellent",
  "createdAt": "2026-08-08T10:00:00.000Z",
  "updatedAt": "2026-08-08T10:00:00.000Z"
}
```

### Collection: `activities`
```json
{
  "_id": "ObjectId",
  "date": "2026-08-08",
  "activityName": "Hatha Yoga Flow",
  "category": "Yoga",
  "duration": 35,
  "description": "Morning energy flow.",
  "createdAt": "2026-08-08T10:00:00.000Z",
  "updatedAt": "2026-08-08T10:00:00.000Z"
}
```

---

## 6. Environment Variables

### React Frontend (`frontend/.env`)
```env
VITE_DJANGO_API_URL=http://localhost:8000/api
VITE_NODE_API_URL=http://localhost:5000/api
```

### Node.js Backend (`node_backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mental_health_db
```

### Django Backend (`django_backend/.env`)
```env
SECRET_KEY=django-insecure-mental-health-tracker-secret-key-ug-project-2026
MONGODB_URI=mongodb://127.0.0.1:27017/mental_health_db
MONGODB_NAME=mental_health_db
```

---

## 7. How to Run the Project

You will need **3 terminal windows** open simultaneously.

### Terminal 1: React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend running at:* `http://localhost:3000`

### Terminal 2: Django Backend
```bash
cd django_backend
pip install -r requirements.txt
python manage.py runserver 8000
```
*Django API running at:* `http://localhost:8000/api/`

### Terminal 3: Node.js Backend
```bash
cd node_backend
npm install
npm run dev
```
*Node.js Express API running at:* `http://localhost:5000/api/`

---

## 8. Database Seeding

To seed the database with initial realistic sample data (10 moods, 10 sleep records, 10 activities, 5 journals):

- **Via Node.js**:
  ```bash
  cd node_backend
  npm run seed
  ```
- **Via Python**:
  ```bash
  cd django_backend
  python seed.py
  ```

---

## 9. API Documentation & Endpoints

### Django REST Framework Endpoints (`http://localhost:8000/api/`)
- `GET / POST` `/api/moods/`
- `GET / PUT / DELETE` `/api/moods/<id>/`
- `GET / POST` `/api/journals/`
- `GET / PUT / DELETE` `/api/journals/<id>/`
- `GET / POST` `/api/sleep/`
- `GET / PUT / DELETE` `/api/sleep/<id>/`
- `GET / POST` `/api/activities/`
- `GET / PUT / DELETE` `/api/activities/<id>/`

### Node.js Express Endpoints (`http://localhost:5000/api/`)
- `GET / POST` `/api/moods`
- `GET / PUT / DELETE` `/api/moods/:id`
- `GET / POST` `/api/journals`
- `GET / PUT / DELETE` `/api/journals/:id`
- `GET / POST` `/api/sleep`
- `GET / PUT / DELETE` `/api/sleep/:id`
- `GET / POST` `/api/activities`
- `GET / PUT / DELETE` `/api/activities/:id`

---

## 10. Screenshots Placeholder

*(Include screenshots of Dashboard, Mood Tracker, Reflection Journal, Sleep Tracker, Activity Tracker, and Reports & Analytics during final college presentation submission).*

- `![Dashboard Mockup](./docs/dashboard.png)`
- `![Mood Tracker](./docs/mood_tracker.png)`
- `![Reports & Analytics](./docs/reports.png)`

---

## 11. Future Enhancements
1. Mobile App Companion built with React Native.
2. AI-assisted sentiment analysis for journal entries (NLP).
3. Export wellness summary report as downloadable PDF for personal keeping.
