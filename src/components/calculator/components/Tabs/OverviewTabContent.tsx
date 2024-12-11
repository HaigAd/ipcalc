import React from 'react';
import { TabContentProps } from './types';
import { CalculatorLayout } from '../CalculatorLayout';

export function OverviewTabContent({ 
  components,
  renderComponent,
  onStateClick
}: Pick<TabContentProps, 'components' | 'renderComponent' | 'onStateClick'>) {
  return (
    <CalculatorLayout
      components={components || []}
      renderComponent={(id) => 
        renderComponent?.(id, id === 'price' ? { onStateClick } : undefined)
      }
    />
  );
}
