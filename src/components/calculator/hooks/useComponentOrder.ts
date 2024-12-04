import { useState } from 'react';

export type ComponentId = 'price' | 'loan' | 'metrics' | 'graph' | 'table';

interface Component {
  id: ComponentId;
  title: string;
  isFullWidth?: boolean;
}

const defaultOrder: Component[] = [
  { id: 'price', title: 'Property Price & Deposit' },
  { id: 'loan', title: 'Loan Details & Options' },
  { id: 'metrics', title: 'Key Metrics' },
  { id: 'graph', title: 'Financial Projections' },
  { id: 'table', title: 'Yearly Projections', isFullWidth: true },
];

export const useComponentOrder = () => {
  const [components] = useState<Component[]>(defaultOrder);
  return { components };
};
