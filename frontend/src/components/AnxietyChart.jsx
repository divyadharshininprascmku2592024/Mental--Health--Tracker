import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AnxietyChart = ({ data = [] }) => {
  const chartData = [...data].reverse().map(item => ({
    date: item.date ? item.date.slice(5) : '',
    anxiety: item.anxietyLevel || 0
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-date">{d.date}</p>
          <p className="tooltip-value" style={{ color: '#8b5cf6' }}>
            Anxiety Level: <strong>{d.anxiety}/10</strong>
          </p>
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
            <linearGradient id="anxietyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 10]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="anxiety" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#anxietyGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnxietyChart;
