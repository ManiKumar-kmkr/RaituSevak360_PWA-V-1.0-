'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', queries: 4000, farmers: 2400 },
  { month: 'Feb', queries: 6200, farmers: 3800 },
  { month: 'Mar', queries: 9800, farmers: 5100 },
  { month: 'Apr', queries: 14000, farmers: 7400 },
  { month: 'May', queries: 21000, farmers: 9800 },
  { month: 'Jun', queries: 32000, farmers: 12480 },
];

export function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip
          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
        />
        <Area
          type="monotone"
          dataKey="queries"
          stroke="#10b981"
          fillOpacity={1}
          fill="url(#colorQueries)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
