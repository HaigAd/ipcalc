import { TabConfig } from './types';
import { PropertyDetailsForm } from '../PropertyDetailsForm';
import { MarketDataForm } from '../MarketDataForm';
import { LoanDetailsForm } from '../LoanDetailsForm';
import { PurchaseCostsForm } from '../PurchaseCostsForm';
import { YearlyProjectionsTable } from '../YearlyProjectionsTable';
import { MarketScenarios } from '../MarketScenarios';

export const TAB_CONFIG: TabConfig[] = [
  {
    id: 'property',
    label: 'Property Details',
    component: PropertyDetailsForm
  },
  {
    id: 'market',
    label: 'Market Data',
    component: MarketDataForm
  },
  {
    id: 'loan',
    label: 'Loan Details',
    component: LoanDetailsForm
  },
  {
    id: 'costs',
    label: 'Purchase Costs',
    component: PurchaseCostsForm
  },
  {
    id: 'projections',
    label: 'Projections',
    component: YearlyProjectionsTable
  },
  {
    id: 'scenarios',
    label: 'Market Scenarios',
    component: MarketScenarios
  }
];
