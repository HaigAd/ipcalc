import { 
  PropertyDetails, 
  MarketData, 
  CostStructure
} from '../../types';
import {
  calculatePropertyProjections,
  calculateOffsetBenefits,
  calculateCGT,
  calculateComparativeMetrics
} from '../index';

export function calculateBaseProjections(
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure
) {
  // Calculate base projections
  const baseProjections = calculatePropertyProjections(propertyDetails, marketData);

  // Apply offset calculations
  const offsetResults = calculateOffsetBenefits(propertyDetails, baseProjections, costStructure);

  // Apply CGT calculations
  const cgtResults = calculateCGT(marketData, propertyDetails, {
    yearlyProjections: offsetResults.yearlyProjections
  });

  // Calculate final comparative metrics
  const comparativeResults = calculateComparativeMetrics(
    propertyDetails,
    marketData,
    costStructure,
    {
      yearlyProjections: cgtResults.yearlyProjections,
      offsetAmount: offsetResults.offsetAmount
    }
  );

  return {
    ...comparativeResults,
    offsetAmount: offsetResults.offsetAmount,
    totalInterestSaved: offsetResults.totalInterestSaved,
    yearsReducedFromLoan: offsetResults.yearsReducedFromLoan,
    monthlyMortgagePayment: baseProjections.monthlyMortgagePayment
  };
}
