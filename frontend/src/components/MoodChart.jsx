import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MoodChart = ({ data = [] }) => {
  const chartData = [...data].reverse().map(item => ({
    date: item.date ? item.date.slice(5) : '',
    rating: item.moodRating || 0,
    mood: item.mood || 'N/A'
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-date">{d.date}</p>
          <p className="tooltip-value">Mood Rating: <strong>{d.rating}/10</strong></p>
          <p className="tooltip-sub">State: {d.mood}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#moodGradient)" />
        </AreaChart>
      </ResponsiveContainer>

      <style>{`
        .custom-chart-tooltip {
          background: #1e293b;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 0.6rem 0.8rem;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          color: #fff;
          box-shadow: var(--shadow-md);
        }
        .tooltip-date { color: var(--text-muted); font-size: 0.75rem; margin-bottom: 0.2rem; }
        .tooltip-value { color: #10b981; font-weight: 600; }
        .tooltip-sub { color: #cbd5e1; font-size: 0.78rem; }
      `}</style>
    </div>
  );
};

export default MoodChart;
