import { useState } from 'react';

export type ComponentId = 'price' | 'loan' | 'table';

interface Component {
  id: ComponentId;
  title: string;
  isFullWidth?: boolean;
}

const defaultOrder: Component[] = [
  { id: 'price', title: 'Property Price & Deposit' },
  { id: 'loan', title: 'Loan Details & Options' },
  { id: 'table', title: 'Yearly Projections', isFullWidth: true },
];

export const useComponentOrder = () => {
  const [components] = useState<Component[]>(defaultOrder);
  return { components };
};
