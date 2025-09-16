
export interface Student {
  id?: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  createdAt?: string;
  isBlocked?:boolean;
}
export interface Teacher {
  id?: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  approvedByAdmin: boolean;
  Action:string;
  createdAt?: string;
  isBlocked?:boolean;
}

import React from 'react';
import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => ReactNode;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  className?: string;
}

export interface ReusableTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  tableTitle?: string;
  actions?: TableAction<T>[] | ((row: T) => TableAction<T>[]);
  className?: string;
}

const ReusableTable = <T extends Record<string, any>>({ columns, data, tableTitle, className = '', actions = [] }: ReusableTableProps<T>) => {
  const safeData = Array.isArray(data) ? data : [];

  const renderValue = (value: any): ReactNode => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
    if (React.isValidElement(value)) return value;
    if (typeof value === 'object' && 'value' in value) return value.value;
    return String(value);
  };

  return (
    <div className={`bg-white p-6  rounded-b-lg shadow-lg overflow-auto ${className}`}>
      {tableTitle && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{tableTitle}</h3>
      )}
      <table className="min-w-full text-sm text-gray-700">
        <thead>
          <tr className="text-left border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th key={String(column.key)} className="py-3 px-4 font-semibold">{column.header}</th>
            ))}
            {actions.length > 0 && <th className="py-3 px-4 font-semibold text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
         {safeData.map((row, index) => {
  const rowActions = typeof actions === "function" ? actions(row) : actions;

  return (
    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 transition-colors">
      {columns.map((column) => (
        <td key={String(column.key)} className="py-3 px-4">
          {column.render ? column.render(row[column.key], row) : renderValue(row[column.key])}
        </td>
      ))}
      {rowActions && rowActions.length > 0 && (
        <td className="py-3 px-4 text-right">
          <div className="flex justify-end gap-2">
            {rowActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => action.onClick(row)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${action.className || 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                title={action.label}
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        </td>
      )}
    </tr>
  );
})}

        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;