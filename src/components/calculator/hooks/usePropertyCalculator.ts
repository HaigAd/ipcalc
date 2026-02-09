import { useMemo } from 'react';
import { 
  PropertyDetails, 
  MarketData, 
  CostStructure, 
  CalculationResults
} from '../types';
import { usePropertyProjections } from './usePropertyProjections';

export const usePropertyCalculator = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure
): CalculationResults => {
  const offsetAmount = Math.max(0, propertyDetails.manualOffsetAmount ?? 0);

  // Get projections with all calculations including investment metrics and CGT
  const projections = usePropertyProjections(propertyDetails, marketData, costStructure, offsetAmount);

  return useMemo(() => ({
    yearlyProjections: projections.yearlyProjections,
    offsetAmount,
    totalInterestSaved: projections.totalInterestSaved,
    yearsReducedFromLoan: projections.yearsReducedFromLoan,
    monthsReducedFromLoan: projections.monthsReducedFromLoan,
    monthlyMortgagePayment: projections.initialMonthlyMortgagePayment,
    principal: projections.principal,
    netPositionAtEnd: projections.netPositionAtEnd,
    totalDepreciation: projections.totalDepreciation,
    averageROI: projections.averageROI,
    finalCGTPayable: projections.finalCGTPayable
  }), [projections, offsetAmount]);
};
