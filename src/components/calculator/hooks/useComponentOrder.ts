import { useState } from 'react';

export type ComponentId = 'price' | 'loan' | 'metrics' | 'graph' | 'table' | 'depreciation' | 'taxImplications';

interface Component {
  id: ComponentId;
  title: string;
  isFullWidth?: boolean;
}

const defaultOrder: Component[] = [
  { id: 'price', title: 'Property Price & Deposit' },
  { id: 'metrics', title: 'Key Metrics' },
  { id: 'loan', title: 'Loan Details & Options' },
  { id: 'graph', title: 'Financial Projections' },
  { id: 'table', title: 'Yearly Projections', isFullWidth: true },
  { id: 'depreciation', title: 'Depreciation Settings' },
  { id: 'taxImplications', title: 'Tax Implications' },
];

export const useComponentOrder = () => {
  const [components] = useState<Component[]>(defaultOrder);
  return { components };
};
