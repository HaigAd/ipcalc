import { useMemo } from 'react';
import { YearlyProjection } from '../../types';
import { ProcessedDataPoint } from './types';

export const useProjectionsData = (yearlyProjections: YearlyProjection[]): ProcessedDataPoint[] => {

  return useMemo(() => {
    
    if (!yearlyProjections?.length) {
      return [];
    }

    // Create data arrays with null values for non-matching points
    const processedData = yearlyProjections.map(point => {
      return {
        ...point,
        year: point.year,
        positiveValue: point.netPosition >= 0 ? point.netPosition : null,
        negativeValue: point.netPosition < 0 ? point.netPosition : null,
        // Add an extra point at the transition
        transitionValue: point.netPosition === 0 ? 0 : null
      };
    });

    // Find transition points and add overlap
    for (let i = 1; i < processedData.length; i++) {
      const prev = processedData[i - 1];
      const curr = processedData[i];
      if ((prev.netPosition >= 0) !== (curr.netPosition >= 0)) {
        // Add overlap by including the value in both segments
        if (prev.netPosition >= 0) {
          prev.negativeValue = prev.netPosition;
        } else {
          prev.positiveValue = prev.netPosition;
        }
      }
    }

    return processedData;
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
