import React from 'react';
import { TabTriggerProps } from './types';

export function TabTrigger({ label, isActive, onClick }: TabTriggerProps) {
  return (
    <button
      className={`
        whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
        ${isActive
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
      `}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
