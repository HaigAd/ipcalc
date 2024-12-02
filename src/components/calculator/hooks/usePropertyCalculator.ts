import { useMemo } from 'react';
import { 
  PropertyDetails, 
  MarketData, 
  CostStructure, 
  CalculationResults
} from '../types';
import { usePropertyProjections } from './usePropertyProjections';
import { useOffsetCalculations } from './useOffsetCalculations';
import { useCGTCalculations } from './useCGTCalculations';
import { useComparativeMetrics } from './useComparativeMetrics';

export const usePropertyCalculator = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure
): CalculationResults => {
  // Get base projections with property value and loan balance calculations
  const baseProjections = usePropertyProjections(propertyDetails, marketData);

  // Calculate offset benefits and interest savings
  const offsetResults = useOffsetCalculations(propertyDetails, baseProjections, costStructure);

  // Calculate CGT implications
  const cgtResults = useCGTCalculations(marketData, propertyDetails, {
    yearlyProjections: offsetResults.yearlyProjections
  });

  // Calculate comparative metrics and final projections
  const comparativeResults = useComparativeMetrics(
    propertyDetails,
    marketData,
    costStructure,
    {
      yearlyProjections: cgtResults.yearlyProjections,
      offsetAmount: offsetResults.offsetAmount
    }
  );

  return useMemo(() => ({
    yearlyProjections: comparativeResults.yearlyProjections,
    breakEvenYear: comparativeResults.breakEvenYear,
    totalCostDifference: comparativeResults.totalCostDifference,
    netPositionAtEnd: comparativeResults.netPositionAtEnd,
    offsetAmount: offsetResults.offsetAmount,
    totalInterestSaved: offsetResults.totalInterestSaved,
    yearsReducedFromLoan: offsetResults.yearsReducedFromLoan,
    monthlyMortgagePayment: baseProjections.monthlyMortgagePayment
  }), [baseProjections, offsetResults, cgtResults, comparativeResults]);
};
