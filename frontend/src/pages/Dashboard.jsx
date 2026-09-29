import React, { useState, useEffect } from 'react';
import { Smile, AlertCircle, Moon, Activity as ActivityIcon, Sparkles, RefreshCw } from 'lucide-react';
import StatCard from '../components/StatCard';
import MoodChart from '../components/MoodChart';
import StressChart from '../components/StressChart';
import SleepChart from '../components/SleepChart';
import { fetchMoods, fetchJournals, fetchSleepRecords, fetchActivities } from '../services/api';

const Dashboard = () => {
  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [sleeps, setSleeps] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [mRes, jRes, sRes, aRes] = await Promise.all([
        fetchMoods(),
        fetchJournals(),
        fetchSleepRecords(),
        fetchActivities()
      ]);
      setMoods(mRes || []);
      setJournals(jRes || []);
      setSleeps(sRes || []);
      setActivities(aRes || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard metrics. Please verify backend API status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    window.addEventListener('backend_changed', loadDashboardData);
    return () => window.removeEventListener('backend_changed', loadDashboardData);
  }, []);

  // Compute Averages
  const avgMood = moods.length
    ? (moods.reduce((acc, curr) => acc + (curr.moodRating || 0), 0) / moods.length).toFixed(1)
    : '0.0';

  const avgStress = moods.length
    ? (moods.reduce((acc, curr) => acc + (curr.stressLevel || 0), 0) / moods.length).toFixed(1)
    : '0.0';

  const avgSleep = sleeps.length
    ? (sleeps.reduce((acc, curr) => acc + (curr.totalHours || 0), 0) / sleeps.length).toFixed(1)
    : '0.0';

  // Compute General Wellness Score (0-100)
  const calcWellnessScore = () => {
    if (!moods.length) return 75;
    const moodFactor = (Number(avgMood) / 10) * 35;
    const stressFactor = ((10 - Number(avgStress)) / 10) * 30;
    const sleepFactor = Math.min(Number(avgSleep) / 8, 1) * 25;
    const actFactor = Math.min(activities.length / 5, 1) * 10;
    return Math.round(moodFactor + stressFactor + sleepFactor + actFactor);
  };
  const wellnessScore = calcWellnessScore();

  // Today's stats
  const latestMood = moods[0] || {};
  const latestSleep = sleeps[0] || {};
  const latestJournal = journals[0] || {};
  const recentActivitiesList = activities.slice(0, 5);

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshCw className="spin-icon" size={32} />
        <p>Loading your Wellness Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome to your Wellness Dashboard</h1>
          <p className="page-subtitle">Track, reflect, and maintain your daily mental health and balance.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={loadDashboardData}>
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {error && (
        <div className="alert alert-warning">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Today's Snapshot Card */}
      <div className="card snapshot-card mb-4">
        <div className="snapshot-header">
          <div className="snapshot-title">
            <Sparkles size={18} className="text-primary" />
            <span>Today's Wellness Snapshot</span>
          </div>
          <span className="snapshot-date">{latestMood.date || 'No recent log'}</span>
        </div>
        <div className="snapshot-grid">
          <div className="snap-item">
            <span className="snap-label">Current Mood</span>
            <span className="snap-val">{latestMood.mood || 'N/A'} ({latestMood.moodRating || 0}/10)</span>
          </div>
          <div className="snap-item">
            <span className="snap-label">Stress Level</span>
            <span className="snap-val">{latestMood.stressLevel || 0}/10</span>
          </div>
          <div className="snap-item">
            <span className="snap-label">Anxiety Level</span>
            <span className="snap-val">{latestMood.anxietyLevel || 0}/10</span>
          </div>
          <div className="snap-item">
            <span className="snap-label">Sleep Duration</span>
            <span className="snap-val">{latestSleep.totalHours ? `${latestSleep.totalHours} hrs` : 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-4 mb-4">
        <StatCard
          title="Average Mood"
          value={`${avgMood}/10`}
          subtitle="Overall Mood Score"
          icon={Smile}
          colorTheme="emerald"
          badgeText="😊 Good"
        />
        <StatCard
          title="Average Stress"
          value={`${avgStress}/10`}
          subtitle="Stress Indicator"
          icon={AlertCircle}
          colorTheme="amber"
          badgeText="😌 Moderate"
        />
        <StatCard
          title="Average Sleep"
          value={`${avgSleep} hrs`}
          subtitle="Daily Sleep Duration"
          icon={Moon}
          colorTheme="blue"
          badgeText="😴 Rested"
        />
        <StatCard
          title="Wellness Score"
          value={`${wellnessScore}/100`}
          subtitle="General Health Index"
          icon={Sparkles}
          colorTheme="purple"
          badgeText="🧘 Balanced"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid-2 mb-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Smile size={18} className="text-emerald" /> Weekly Mood Trend</h3>
          </div>
          <MoodChart data={moods.slice(0, 7)} />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><AlertCircle size={18} className="text-amber" /> Stress Level Trend</h3>
          </div>
          <StressChart data={moods.slice(0, 7)} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Moon size={18} className="text-blue" /> Sleep Duration Trend</h3>
          </div>
          <SleepChart data={sleeps.slice(0, 7)} />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><ActivityIcon size={18} className="text-teal" /> Recent Activities & Log</h3>
          </div>
          {recentActivitiesList.length === 0 ? (
            <div className="empty-state">
              <p>No recent physical or mental activities logged.</p>
            </div>
          ) : (
            <div className="activity-mini-list">
              {recentActivitiesList.map((act) => (
                <div key={act._id} className="activity-mini-item">
                  <div>
                    <strong>{act.activityName}</strong>
                    <span className="act-cat">{act.category}</span>
                  </div>
                  <div className="act-dur">{act.duration} mins</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .mb-4 { margin-bottom: 1.5rem; }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          gap: 1rem;
          color: var(--text-muted);
        }
        .spin-icon { animation: spin 1s linear infinite; color: var(--primary); }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .snapshot-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
          border-left: 4px solid var(--primary);
        }
        .snapshot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding-bottom: 0.5rem;
        }
        .snapshot-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }
        .snapshot-date {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .snapshot-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .snap-item {
          display: flex;
          flex-direction: column;
        }
        .snap-label { font-size: 0.78rem; color: var(--text-muted); }
        .snap-val { font-size: 1.05rem; font-weight: 600; color: #fff; margin-top: 0.2rem; }

        .activity-mini-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .activity-mini-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.8rem;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: var(--radius-md);
        }
        .act-cat {
          display: block;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .act-dur {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-teal);
        }

        @media (max-width: 768px) {
          .snapshot-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
