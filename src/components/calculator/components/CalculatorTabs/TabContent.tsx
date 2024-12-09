import React from 'react';
import { TabContentProps } from './types';

export function TabContent({ children, isActive }: TabContentProps) {
  if (!isActive) return null;

  return (
    <div className="py-4">
      {children}
    </div>
  );
}
