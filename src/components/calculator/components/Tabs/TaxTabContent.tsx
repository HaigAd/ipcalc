import React from 'react';
import { TabContentProps } from './types';

export function TaxTabContent({
  renderComponent
}: Pick<TabContentProps, 'renderComponent'>) {
  return renderComponent?.('taxImplications') || null;
}
