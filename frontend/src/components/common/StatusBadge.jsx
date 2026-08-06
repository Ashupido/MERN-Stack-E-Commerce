import React from 'react';

export default function StatusBadge({ status }) {
  let bgColor = 'bg-gray-500';
  let textColor = 'text-white';

  if (status === 'active') {
    bgColor = 'bg-green-500';
  } else if (status === 'inactive') {
    bgColor = 'bg-red-500';
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}