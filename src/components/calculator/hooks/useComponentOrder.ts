import { useState } from 'react';

export type ComponentId = 'price' | 'loan' | 'graph' | 'table' | 'taxImplications';

interface Component {
  id: ComponentId;
  title: string;
  isFullWidth?: boolean;
}

const defaultOrder: Component[] = [
  { id: 'price', title: 'Property Price & Deposit' },
  { id: 'loan', title: 'Loan Details & Options' },
  { id: 'graph', title: 'Financial Projections' },
  { id: 'table', title: 'Yearly Projections', isFullWidth: true },
  { id: 'taxImplications', title: 'Tax & Depreciation' },
];

export const useComponentOrder = () => {
  const [components] = useState<Component[]>(defaultOrder);
  return { components };
};
