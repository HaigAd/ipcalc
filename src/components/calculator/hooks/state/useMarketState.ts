import { useState } from 'react';
import { MarketData } from '../../types';
import { defaultMarketData } from '../../config/defaults';
import { getStoredState } from '../useFormPersistence';

export function useMarketState() {
  const storedState = getStoredState();
  
  const [marketData, setMarketData] = useState<MarketData>(
    storedState?.marketData || defaultMarketData
  );

  return {
    marketData,
    setMarketData,
  };
}
