import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (item: any) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-primary text-white">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick && onRowClick(item)}
              className={`${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(item[column.key]) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 