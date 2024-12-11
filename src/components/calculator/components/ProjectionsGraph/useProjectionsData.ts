import { useMemo } from 'react';
import { YearlyProjection } from '../../types';
import { ProcessedDataPoint } from './types';

export const useProjectionsData = (yearlyProjections: YearlyProjection[]): ProcessedDataPoint[] => {
  return useMemo(() => {
    if (!yearlyProjections?.length) {
      return [];
    }

    return yearlyProjections.map(point => ({
      ...point,
      year: point.year,
      equity: point.equity,
      cashFlow: point.cashFlow,
      rentalIncome: point.rentalIncome
    }));
  }, [yearlyProjections]);
};

export const formatAxisValue = (value: number): string => {
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};
