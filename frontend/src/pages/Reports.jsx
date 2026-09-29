import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Smile,
  AlertCircle,
  Moon,
  Activity as ActivityIcon,
  BookOpen,
  Sparkles,
  ShieldAlert,
  Lightbulb,
  Heart
} from 'lucide-react';
import StatCard from '../components/StatCard';
import MoodChart from '../components/MoodChart';
import StressChart from '../components/StressChart';
import SleepChart from '../components/SleepChart';
import AnxietyChart from '../components/AnxietyChart';
import ActivityChart from '../components/ActivityChart';
import MoodDistributionChart from '../components/MoodDistributionChart';
import { fetchMoods, fetchJournals, fetchSleepRecords, fetchActivities } from '../services/api';

const Reports = () => {
  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [sleeps, setSleeps] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllMetrics = async () => {
    setLoading(true);
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
      console.error('Error fetching report analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMetrics();
    window.addEventListener('backend_changed', loadAllMetrics);
    return () => window.removeEventListener('backend_changed', loadAllMetrics);
  }, []);

  // Compute Averages
  const avgMood = moods.length
    ? (moods.reduce((acc, curr) => acc + (curr.moodRating || 0), 0) / moods.length).toFixed(1)
    : '0.0';

  const avgStress = moods.length
    ? (moods.reduce((acc, curr) => acc + (curr.stressLevel || 0), 0) / moods.length).toFixed(1)
    : '0.0';

  const avgAnxiety = moods.length
    ? (moods.reduce((acc, curr) => acc + (curr.anxietyLevel || 0), 0) / moods.length).toFixed(1)
    : '0.0';

  const avgSleep = sleeps.length
    ? (sleeps.reduce((acc, curr) => acc + (curr.totalHours || 0), 0) / sleeps.length).toFixed(1)
    : '0.0';

  // Compute General Wellness Score
  const calcWellnessScore = () => {
    if (!moods.length) return 75;
    const moodFactor = (Number(avgMood) / 10) * 35;
    const stressFactor = ((10 - Number(avgStress)) / 10) * 30;
    const sleepFactor = Math.min(Number(avgSleep) / 8, 1) * 25;
    const actFactor = Math.min(activities.length / 5, 1) * 10;
    return Math.round(moodFactor + stressFactor + sleepFactor + actFactor);
  };
  const wellnessScore = calcWellnessScore();

  // Dynamic Wellness Suggestions based on recorded metrics
  const getSuggestions = () => {
    const suggestions = [];

    if (Number(avgSleep) < 7.0) {
      suggestions.push({
        type: 'sleep',
        title: 'Sleep Optimization',
        text: 'Try maintaining a consistent sleep schedule and getting adequate rest (7–8 hours per night).'
      });
    }

    if (Number(avgStress) > 5.5) {
      suggestions.push({
        type: 'stress',
        title: 'Stress Relief & Relaxation',
        text: 'Consider taking short breaks throughout the day, practicing relaxation techniques, or talking to someone you trust.'
      });
    }

    if (activities.length < 5) {
      suggestions.push({
        type: 'activity',
        title: 'Physical Activity',
        text: 'Consider adding a short 15-minute walk, yoga session, or light physical activity to your daily routine.'
      });
    }

    if (Number(avgMood) < 5.0) {
      suggestions.push({
        type: 'support',
        title: 'Emotional Support Notice',
        text: 'If your mood remains consistently low over time, consider reaching out to a trusted person, counselor, or qualified mental-health professional for support.'
      });
    }

    // Default positive suggestion if everything looks good
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'positive',
        title: 'Maintain Healthy Balance',
        text: 'Great work maintaining a balanced daily routine! Keep tracking your mood, activities, and reflections regularly.'
      });
    }

    return suggestions;
  };

  const suggestionsList = getSuggestions();

  if (loading) {
    return <p className="text-muted p-4">Loading analytics and wellness reports...</p>;
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Wellness Analytics</h1>
          <p className="page-subtitle">Detailed graphical insights, trends analysis, and personalized suggestions.</p>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="alert alert-info mb-4">
        <ShieldAlert size={20} className="disclaimer-icon" />
        <div>
          <strong>Educational & General Wellness Disclaimer</strong>
          <p style={{ marginTop: '0.25rem', fontSize: '0.84rem' }}>
            This application is intended for general wellness tracking and educational purposes only. It is not a substitute for professional medical or mental-health advice, diagnosis, or treatment.
          </p>
        </div>
      </div>

      {/* Wellness Score & Overview Banner */}
      <div className="card wellness-score-card mb-4">
        <div className="wellness-score-header">
          <div>
            <span className="ws-subtitle">OVERALL WELLNESS INDEX</span>
            <h2 className="ws-title">General Wellness Score: {wellnessScore}/100</h2>
            <p className="ws-desc">Calculated using mood ratings, stress management, sleep duration, and physical activities.</p>
          </div>
          <div className="ws-badge-circle">
            <Sparkles size={32} />
            <span>{wellnessScore}</span>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid-3 mb-4">
        <StatCard title="Average Mood" value={`${avgMood}/10`} subtitle="7-Day Average" icon={Smile} colorTheme="emerald" />
        <StatCard title="Average Stress" value={`${avgStress}/10`} subtitle="7-Day Average" icon={AlertCircle} colorTheme="amber" />
        <StatCard title="Average Anxiety" value={`${avgAnxiety}/10`} subtitle="7-Day Average" icon={Heart} colorTheme="purple" />
        <StatCard title="Average Sleep" value={`${avgSleep} hrs`} subtitle="Daily Duration" icon={Moon} colorTheme="blue" />
        <StatCard title="Total Activities" value={`${activities.length}`} subtitle="Recorded Habits" icon={ActivityIcon} colorTheme="teal" />
        <StatCard title="Total Journals" value={`${journals.length}`} subtitle="Written Entries" icon={BookOpen} colorTheme="emerald" />
      </div>

      {/* 6 Required Charts Grid */}
      <h2 className="section-heading mb-3"><BarChart3 size={20} /> Comprehensive Wellness Visualizations</h2>
      
      <div className="grid-2 mb-4">
        {/* Chart 1: Weekly Mood Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Smile size={18} className="text-emerald" /> 1. Weekly Mood Trend</h3>
          </div>
          <MoodChart data={moods} />
        </div>

        {/* Chart 2: Weekly Stress Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><AlertCircle size={18} className="text-amber" /> 2. Weekly Stress Trend</h3>
          </div>
          <StressChart data={moods} />
        </div>
      </div>

      <div className="grid-2 mb-4">
        {/* Chart 3: Weekly Anxiety Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Heart size={18} className="text-purple" /> 3. Weekly Anxiety Trend</h3>
          </div>
          <AnxietyChart data={moods} />
        </div>

        {/* Chart 4: Sleep Duration Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><Moon size={18} className="text-blue" /> 4. Sleep Duration Trend</h3>
          </div>
          <SleepChart data={sleeps} />
        </div>
      </div>

      <div className="grid-2 mb-4">
        {/* Chart 5: Activity Duration Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><ActivityIcon size={18} className="text-teal" /> 5. Activity Duration Chart</h3>
          </div>
          <ActivityChart data={activities} />
        </div>

        {/* Chart 6: Mood Distribution Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><BarChart3 size={18} className="text-emerald" /> 6. Mood Distribution Breakdown</h3>
          </div>
          <MoodDistributionChart data={moods} />
        </div>
      </div>

      {/* Personalized Wellness Suggestions */}
      <div className="card suggestions-card">
        <div className="card-header">
          <h3 className="card-title"><Lightbulb size={20} className="text-amber" /> Personalized Wellness Suggestions</h3>
        </div>
        <div className="suggestions-list">
          {suggestionsList.map((item, idx) => (
            <div key={idx} className="suggestion-item">
              <div className="suggestion-bullet">💡</div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .mb-3 { margin-bottom: 1rem; }
        .section-heading {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.3rem;
          margin-top: 1rem;
        }

        .wellness-score-card {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .wellness-score-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ws-subtitle { font-size: 0.75rem; font-weight: 700; color: var(--primary); letter-spacing: 0.05em; }
        .ws-title { font-size: 1.6rem; font-weight: 700; color: #fff; margin: 0.2rem 0; }
        .ws-desc { font-size: 0.88rem; color: var(--text-muted); }
        .ws-badge-circle {
          width: 70px;
          height: 70px;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
        }
        .ws-badge-circle span { font-weight: 800; font-size: 0.95rem; }

        .suggestions-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
        }
        .suggestions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .suggestion-item {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          padding: 0.85rem 1rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-md);
        }
        .suggestion-bullet { font-size: 1.2rem; }
        .suggestion-item strong { color: #fde047; font-size: 0.95rem; }
        .suggestion-item p { color: var(--text-muted); font-size: 0.88rem; margin-top: 0.2rem; }
      `}</style>
    </div>
  );
};

export default Reports;
