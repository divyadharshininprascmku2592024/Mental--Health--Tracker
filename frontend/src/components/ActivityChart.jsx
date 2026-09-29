import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const ActivityChart = ({ data = [] }) => {
  // Aggregate total activity duration per category
  const categoryTotals = {};
  data.forEach(item => {
    const cat = item.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(item.duration) || 0);
  });

  const chartData = Object.keys(categoryTotals).map(cat => ({
    category: cat,
    duration: categoryTotals[cat]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <p className="tooltip-date">Category: <strong>{d.category}</strong></p>
          <p className="tooltip-value" style={{ color: '#14b8a6' }}>
            Total Time: <strong>{d.duration} mins</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="category" stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="duration" fill="#14b8a6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
