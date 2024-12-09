import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { TabContent } from './TabContent';
import { TabTrigger } from './TabTrigger';
import { TabConfig } from './types';
import { TAB_CONFIG } from './config';

export function CalculatorTabs() {
  const [activeTab, setActiveTab] = React.useState<string>(TAB_CONFIG[0].id);

  const renderTabContent = (tab: TabConfig) => {
    const Component = tab.component;
    return <Component />;
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {TAB_CONFIG.map((tab) => (
            <TabTrigger
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>
      <div className="mt-4">
        {TAB_CONFIG.map((tab) => (
          <TabContent key={tab.id} isActive={activeTab === tab.id}>
            {renderTabContent(tab)}
          </TabContent>
        ))}
      </div>
    </div>
  );
}
