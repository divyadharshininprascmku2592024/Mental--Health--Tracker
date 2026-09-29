import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const MoodDistributionChart = ({ data = [] }) => {
  const counts = {
    'Very Happy': 0,
    'Happy': 0,
    'Neutral': 0,
    'Sad': 0,
    'Very Sad': 0
  };

  data.forEach(item => {
    if (counts[item.mood] !== undefined) {
      counts[item.mood] += 1;
    }
  });

  const chartData = Object.keys(counts)
    .filter(key => counts[key] > 0)
    .map(key => ({
      name: key,
      value: counts[key]
    }));

  const COLORS = {
    'Very Happy': '#2dd4bf',
    'Happy': '#34d399',
    'Neutral': '#fbbf24',
    'Sad': '#60a5fa',
    'Very Sad': '#f87171'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0];
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-value" style={{ color: d.payload.fill }}>
            {d.name}: <strong>{d.value} days</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      {chartData.length === 0 ? (
        <div className="empty-chart">No mood distribution data available</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} formatter={(val) => <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{val}</span>} />
          </PieChart>
        </ResponsiveContainer>
      )}

      <style>{`
        .empty-chart {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

export default MoodDistributionChart;
