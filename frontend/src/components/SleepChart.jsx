import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SleepChart = ({ data = [] }) => {
  const chartData = [...data].reverse().map(item => ({
    date: item.date ? item.date.slice(5) : '',
    hours: item.totalHours || 0,
    quality: item.quality || 'N/A'
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-date">{d.date}</p>
          <p className="tooltip-value" style={{ color: '#3b82f6' }}>
            Sleep Duration: <strong>{d.hours} hrs</strong>
          </p>
          <p className="tooltip-sub">Quality: {d.quality}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 12]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepChart;
