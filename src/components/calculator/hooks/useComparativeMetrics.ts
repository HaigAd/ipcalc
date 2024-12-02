import { useMemo } from 'react';
import { CostStructure, YearlyProjection, PropertyDetails, MarketData } from '../types';

export const useComparativeMetrics = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure,
  baseProjections: { 
    yearlyProjections: YearlyProjection[];
    offsetAmount: number;
  }
) => {
  return useMemo(() => {
    const { yearlyProjections, offsetAmount } = baseProjections;
    const totalBuyingCosts = propertyDetails.depositAmount + costStructure.purchaseCosts.total;
    
    let cumulativeBuyingCosts = totalBuyingCosts;
    let cumulativeRentalCosts = 0;
    let breakEvenYear = -1;
    let cumulativePrincipalSavingsOpportunityCost = 0;

    const updatedProjections = yearlyProjections.map(projection => {
      // Calculate opportunity cost on the deposit and offset amount
      const yearlyOpportunityCost = (totalBuyingCosts + offsetAmount) * 
        (Math.pow(1 + marketData.opportunityCostRate / 100, projection.year) - 
         Math.pow(1 + marketData.opportunityCostRate / 100, projection.year - 1));

      // Calculate opportunity cost on the equivalent principal payments
      // This represents what a renter could earn by investing the same amount
      const yearlyPrincipalSavingsOpportunityCost = projection.cumulativePrincipalPaid * 
        (marketData.opportunityCostRate / 100);
      
      cumulativePrincipalSavingsOpportunityCost += yearlyPrincipalSavingsOpportunityCost;

      const yearlyPropertyCosts = costStructure.annualPropertyCosts;
      
      // Calculate yearly costs for buying scenario
      const yearlyBuyingCosts = (projection.originalLoanBalance * (propertyDetails.interestRate / 100)) - 
                               projection.interestSaved + 
                               yearlyPropertyCosts + 
                               yearlyOpportunityCost + 
                               projection.yearlyCGT;
      
      // Update cumulative costs
      cumulativeBuyingCosts += yearlyBuyingCosts;
      cumulativeRentalCosts += projection.rentalCosts;

      // Calculate potential sale costs
      const potentialSaleCosts = projection.propertyValue * (costStructure.futureSellCostsPercentage / 100);
      
      // Calculate net position using original loan amount and including opportunity cost of principal savings
      const netPosition = (cumulativeRentalCosts + cumulativePrincipalSavingsOpportunityCost) - 
                         cumulativeBuyingCosts +
                         (projection.propertyValue - projection.originalLoanBalance - potentialSaleCosts);

      // Check for break-even
      if (breakEvenYear === -1 && netPosition > 0) {
        breakEvenYear = projection.year;
      }

      return {
        ...projection,
        totalCosts: yearlyBuyingCosts,
        cumulativeBuyingCosts,
        cumulativeRentalCosts,
        yearlyOpportunityCost,
        yearlyPrincipalSavingsOpportunityCost,
        cumulativePrincipalSavingsOpportunityCost,
        netPosition
      };
    });

    const lastProjection = updatedProjections[updatedProjections.length - 1];
    const totalCostDifference = updatedProjections.reduce(
      (acc, curr) => acc + (curr.totalCosts - curr.rentalCosts),
      0
    );

    return {
      yearlyProjections: updatedProjections,
      breakEvenYear: breakEvenYear === -1 ? propertyDetails.loanTerm + 1 : breakEvenYear,
      totalCostDifference,
      netPositionAtEnd: lastProjection.netPosition
    };
  }, [propertyDetails, marketData, costStructure, baseProjections]);
};
