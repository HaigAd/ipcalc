import { TabsContent } from '../../../ui/tabs';
import { ReactNode } from 'react';

interface TabContentProps {
  value: string;
  children: ReactNode;
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
