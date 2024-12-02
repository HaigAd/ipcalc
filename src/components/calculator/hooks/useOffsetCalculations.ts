import { useMemo } from 'react';
import { PropertyDetails, YearlyProjection, CostStructure } from '../types';

export const useOffsetCalculations = (
  propertyDetails: PropertyDetails,
  baseProjections: { yearlyProjections: YearlyProjection[]; principal: number },
  costStructure: CostStructure
) => {
  return useMemo(() => {
    const { yearlyProjections, principal } = baseProjections;
    const totalBuyingCosts = propertyDetails.depositAmount + costStructure.purchaseCosts.total;
    const remainingSavings = propertyDetails.availableSavings - totalBuyingCosts;
    const offsetAmount = remainingSavings;

    let cumulativeInterestSaved = 0;
    const updatedProjections = yearlyProjections.map(projection => {
      const effectiveLoanBalance = Math.max(projection.originalLoanBalance - offsetAmount, 0);
      const yearlyInterestCost = projection.originalLoanBalance * (propertyDetails.interestRate / 100);
      const effectiveInterest = effectiveLoanBalance * (propertyDetails.interestRate / 100);
      const interestSaved = yearlyInterestCost - effectiveInterest;
      cumulativeInterestSaved += interestSaved;

      return {
        ...projection,
        offsetBalance: offsetAmount,
        interestSaved,
        cumulativeInterestSaved,
        effectiveLoanBalance
      };
    });

    const yearsReducedFromLoan = Math.floor(
      (cumulativeInterestSaved / (principal * (propertyDetails.interestRate / 100) * propertyDetails.loanTerm)) 
      * propertyDetails.loanTerm
    );

    return {
      yearlyProjections: updatedProjections,
      offsetAmount,
      totalInterestSaved: cumulativeInterestSaved,
      yearsReducedFromLoan
    };
  }, [propertyDetails, baseProjections, costStructure]);
};
