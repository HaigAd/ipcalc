import React from 'react';
import { TabsContent } from '../../../ui/tabs';

interface TabContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabContent({ value, children }: TabContentProps) {
  return (
    <TabsContent value={value}>
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
        {children}
      </div>
    </TabsContent>
  );
}
