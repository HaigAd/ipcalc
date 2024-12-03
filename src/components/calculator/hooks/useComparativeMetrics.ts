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
    
    // Initial investment that would be required for property
    const initialInvestment = propertyDetails.depositAmount + 
                            costStructure.purchaseCosts.total

    let cumulativeInvestmentReserves = initialInvestment + offsetAmount;
    let cumulativeBuyingCosts = 0;
    let cumulativeRentalCosts = 0;
    let breakEvenYear = -1;
    let cumulativeOpportunityCost = 0;

    const updatedProjections = yearlyProjections.map(projection => {
      
      const yearlyMortgageCashflow = projection.yearlyPrincipalPaid + 
                                    (projection.effectiveLoanBalance * (propertyDetails.interestRate / 100));
      const yearlyMortgageCost = projection.effectiveLoanBalance * (propertyDetails.interestRate / 100);

      // Calculate total yearly property ownership costs
      const yearlyPropertyCosts = yearlyMortgageCost + 
                                costStructure.annualPropertyCosts + 
                                projection.yearlyCGT;

      const yearlyPropertyCashflow = yearlyMortgageCashflow + costStructure.annualPropertyCosts

      // Calculate yearly cash flow difference (what a renter saves by not buying)
      const yearlyRentVsBuyCashFlow = yearlyPropertyCashflow - projection.rentalCosts;

      // Add this year's savings to investment reserves
      cumulativeInvestmentReserves += yearlyRentVsBuyCashFlow;

      // Calculate opportunity cost on cumulative investment reserves
      const yearlyOpportunityCost = cumulativeInvestmentReserves * 
                                   (marketData.opportunityCostRate / 100);

      // Add opportunity cost to running totals
      cumulativeOpportunityCost += yearlyOpportunityCost;
      cumulativeInvestmentReserves += yearlyOpportunityCost;

      // Update cumulative costs
      cumulativeBuyingCosts += yearlyPropertyCosts;
      cumulativeRentalCosts += projection.rentalCosts;

      //
      const houseAppreciation = projection.propertyValue - propertyDetails.depositAmount - projection.originalLoanBalance

      // Calculate potential sale costs
      const potentialSaleCosts = projection.propertyValue * 
                                (costStructure.futureSellCostsPercentage / 100);
      
      // Calculate net position comparing property investment vs renting and investing
      // Now using cumulative opportunity cost instead of total investment reserves
      const netPosition = -cumulativeOpportunityCost - cumulativeBuyingCosts - costStructure.purchaseCosts.total +
                        + cumulativeRentalCosts + houseAppreciation - potentialSaleCosts;
                         console.log(`Net Position Calculation:
                          Year: ${projection.year}
                          Cumulative Opportunity Cost: ${cumulativeOpportunityCost}
                          Cumulative Rental Costs: ${cumulativeRentalCosts}
                          Cumulative Buying Costs: ${cumulativeBuyingCosts}
                           -- Mortgage Cost: ${yearlyMortgageCost}
                           -- Other costs: ${costStructure.annualPropertyCosts}
                           -- CGT: ${projection.yearlyCGT}
                          Cashflow: ${yearlyRentVsBuyCashFlow}
                          Property Value: ${projection.propertyValue}
                          House Appreciation: ${houseAppreciation}
                          Original Loan Balance: ${projection.originalLoanBalance}
                          Potential Sale Costs: ${potentialSaleCosts}
                          Final Net Position: ${netPosition}
                        `);

      // Check for break-even - now checking for when netPosition becomes positive
      if (breakEvenYear === -1 && netPosition >= 0) {
        breakEvenYear = projection.year;
      }

      const result = {
        ...projection,
        totalCosts: yearlyPropertyCosts,
        cumulativeBuyingCosts,
        cumulativeRentalCosts,
        yearlyOpportunityCost,
        yearlyRentVsBuyCashFlow,
        cumulativeInvestmentReserves,
        cumulativeOpportunityCost,
        netPosition
      };

      return result;
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
