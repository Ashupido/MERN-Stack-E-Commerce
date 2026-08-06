import React from 'react';

/**
 * Generic data table component used in admin pages.
 *
 * Props:
 * - headers: [{ key: string, label: string, align?: 'left' | 'center' | 'right' }]
 * - data: Array<object> – each object should contain values for the keys defined in headers.
 *   Values can be primitives or JSX elements (e.g., action buttons).
 * - noDataMessage?: string – message displayed when data array is empty.
 */
export default function DataTable({ headers = [], data = [], noDataMessage = 'No data available.' }) {
  const getAlignClass = (align) => {
    switch (align) {
      case 'right':
        return 'text-right';
      case 'center':
        return 'text-center';
      default:
        return 'text-left';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-900/60 shadow-lg">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            {headers.map((header) => (
              <th
                key={header.key}
                className={`px-4 py-2 text-sm font-medium text-gray-200 ${getAlignClass(header.align)}`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-4 text-center text-gray-400">
                {noDataMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                {headers.map((header) => (
                  <td
                    key={header.key}
                    className={`px-4 py-2 text-sm text-gray-100 ${getAlignClass(header.align)}`}
                  >
                    {row[header.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
