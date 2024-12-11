import { useMemo } from 'react';
import { 
  PropertyDetails, 
  MarketData, 
  CostStructure, 
  CalculationResults
} from '../types';
import { usePropertyProjections } from './usePropertyProjections';
import { useCGTCalculations } from './useCGTCalculations';

export const usePropertyCalculator = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure
): CalculationResults => {
  // Calculate offset amount first
  // Offset is what's left from savings after deposit and purchase costs
  const totalUpfrontCosts = propertyDetails.depositAmount + costStructure.purchaseCosts.total;
  const offsetAmount = Math.max(0, propertyDetails.availableSavings - totalUpfrontCosts);

  // Get projections with all calculations including investment metrics
  const projections = usePropertyProjections(propertyDetails, marketData, costStructure, offsetAmount);

  // Calculate CGT implications
  const cgtResults = useCGTCalculations(marketData, propertyDetails, {
    yearlyProjections: projections.yearlyProjections
  });

  return useMemo(() => ({
    yearlyProjections: cgtResults.yearlyProjections,
    offsetAmount,
    totalInterestSaved: projections.totalInterestSaved,
    yearsReducedFromLoan: projections.yearsReducedFromLoan,
    monthsReducedFromLoan: projections.monthsReducedFromLoan,
    monthlyMortgagePayment: projections.monthlyMortgagePayment,
    principal: projections.principal,
    netPositionAtEnd: projections.netPositionAtEnd,
    totalDepreciation: projections.totalDepreciation,
    averageROI: projections.averageROI
  }), [projections, cgtResults, offsetAmount]);
};
