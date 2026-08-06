import React from 'react';

/**
 * Reusable statistic card component for the admin dashboard.
 * Props:
 *  - title: string – label of the metric
 *  - value: string | number – displayed value
 *  - icon: ReactNode – optional icon JSX
 */
export default function StatsCard({ title, value, icon }) {
  return (
    <div className="flex items-center rounded-xl border border-gray-800 bg-gray-900/60 p-4 shadow-lg shadow-black/30 transition-colors hover:border-cyan-500/40">
      {icon && <div className="mr-4 text-cyan-400">{icon}</div>}
      <div>
        <p className="text-xs font-medium uppercase text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
