import { Home, TrendingUp, CreditCard, Receipt, Calculator } from 'lucide-react';

export interface TabConfig {
  id: string;
  icon: typeof Home;
  shortLabel: string;
  fullLabel: string;
}

export const TAB_CONFIG: TabConfig[] = [
  {
    id: 'overview',
    icon: Home,
    shortLabel: 'Overview',
    fullLabel: 'Investment Overview'
  },
  {
    id: 'income',
    icon: Receipt,
    shortLabel: 'Income',
    fullLabel: 'Income & Expenses'
  },
  {
    id: 'market',
    icon: TrendingUp,
    shortLabel: 'Market',
    fullLabel: 'Market Analysis'
  },
  {
    id: 'tax',
    icon: Calculator,
    shortLabel: 'Tax',
    fullLabel: 'Tax & Depreciation'
  },
  {
    id: 'purchase',
    icon: CreditCard,
    shortLabel: 'Purchase',
    fullLabel: 'Purchase Costs'
  },
  {
    id: 'scenario-comparison',
    icon: Calculator,
    shortLabel: 'Scenarios',
    fullLabel: 'Scenario Comparison'
  }
];
