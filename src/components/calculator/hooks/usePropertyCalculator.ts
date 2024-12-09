import { useMemo } from 'react';
import { 
  PropertyDetails, 
  MarketData, 
  CostStructure, 
  CalculationResults
} from '../types';
import { usePropertyProjections } from './usePropertyProjections';
import { useCGTCalculations } from './useCGTCalculations';
import { useComparativeMetrics } from './useComparativeMetrics';

export const usePropertyCalculator = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure
): CalculationResults => {
  // Calculate offset amount first
  // Offset is what's left from savings after deposit and purchase costs
  const totalUpfrontCosts = propertyDetails.depositAmount + costStructure.purchaseCosts.total;
  const offsetAmount = Math.max(0, propertyDetails.availableSavings - totalUpfrontCosts);

  // Get base projections with property value, loan balance, and offset calculations
  const baseProjections = usePropertyProjections(propertyDetails, marketData, offsetAmount);

  // Calculate CGT implications
  const cgtResults = useCGTCalculations(marketData, propertyDetails, {
    yearlyProjections: baseProjections.yearlyProjections
  });

  // Calculate comparative metrics and final projections
  const comparativeResults = useComparativeMetrics(
    propertyDetails,
    marketData,
    costStructure,
    {
      yearlyProjections: cgtResults.yearlyProjections,
      offsetAmount
    }
  );

  return useMemo(() => ({
    yearlyProjections: comparativeResults.yearlyProjections,
    breakEvenYear: comparativeResults.breakEvenYear,
    totalCostDifference: comparativeResults.totalCostDifference,
    netPositionAtEnd: comparativeResults.netPositionAtEnd,
    offsetAmount,
    totalInterestSaved: baseProjections.totalInterestSaved,
    yearsReducedFromLoan: baseProjections.yearsReducedFromLoan,
    monthsReducedFromLoan: baseProjections.monthsReducedFromLoan,
    monthlyMortgagePayment: baseProjections.monthlyMortgagePayment,
    principal: baseProjections.principal
  }), [baseProjections, cgtResults, comparativeResults, offsetAmount]);
};
