import React from 'react';
import { TabContentProps } from './types';
import { MarketDataForm } from '../MarketDataForm';

export function MarketTabContent({
  marketData,
  onMarketDataChange
}: Pick<TabContentProps, 'marketData' | 'onMarketDataChange'>) {
  return (
    <MarketDataForm
      marketData={marketData}
      setMarketData={onMarketDataChange}
    />
  );
}
