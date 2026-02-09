import { TabsTrigger } from '../../../ui/tabs';
import { cn } from '../../../../lib/utils';
import { TabConfig } from './config';

interface TabTriggerProps {
  tab: TabConfig;
}

const tabTriggerStyles = cn(
  "flex-1",
  "px-2 py-1.5 text-xs sm:text-sm font-medium",
  "rounded-md transition-all duration-200",
  "text-slate-700 hover:text-slate-900",
  "data-[state=active]:bg-white",
  "data-[state=active]:text-slate-900",
  "data-[state=active]:shadow-sm",
  "data-[state=active]:ring-1",
  "data-[state=active]:ring-slate-200/50",
  "mx-0.5",
  "flex items-center justify-center gap-1.5"
);

export function CustomTabTrigger({ tab }: TabTriggerProps) {
  const Icon = tab.icon;
  const tutorialTarget = tab.id === 'scenario-comparison' ? 'scenario-comparison-tab' : `tab-${tab.id}`;
  
  return (
    <TabsTrigger value={tab.id} className={tabTriggerStyles} data-tutorial={tutorialTarget}>
      <Icon className="h-4 w-4" />
      <span className="sm:hidden">{tab.shortLabel}</span>
      <span className="hidden sm:inline">{tab.fullLabel}</span>
    </TabsTrigger>
  );
}
