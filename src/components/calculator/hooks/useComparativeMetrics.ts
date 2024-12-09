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
                            costStructure.purchaseCosts.total;

    let cumulativeInvestmentReserves = initialInvestment + offsetAmount;
    let cumulativeBuyingCosts = 0;
    let cumulativeRentalCosts = 0;
    let breakEvenYear = -1;
    let cumulativeOpportunityCost = 0;

    const updatedProjections = yearlyProjections.map(projection => {
      // Use the yearlyInterestPaid value from usePropertyProjections which uses monthly compounding
      const yearlyMortgageCost = projection.yearlyInterestPaid;

      // Calculate total yearly property ownership costs
      const yearlyPropertyCosts = yearlyMortgageCost + 
                                costStructure.annualPropertyCosts + 
                                projection.yearlyCGT;

      // Use the appreciated rental costs from projections
      const yearlyRentalIncome = projection.rentalCosts;

      // For cashflow calculations, use rental income minus total mortgage payment (principal + interest) minus annual costs
      const yearlyMortgagePayment = projection.yearlyPrincipalPaid + yearlyMortgageCost;
      const yearlyPropertyCashflow = yearlyMortgagePayment + costStructure.annualPropertyCosts - yearlyRentalIncome;

      // Calculate yearly cash flow difference
      const yearlyRentVsBuyCashFlow = yearlyPropertyCashflow;

      // Add this year's savings and offset contributions to investment reserves
      cumulativeInvestmentReserves += yearlyRentVsBuyCashFlow + projection.yearlyOffsetContributions;

      // Calculate opportunity cost on cumulative investment reserves
      const yearlyOpportunityCost = cumulativeInvestmentReserves * 
                                   (marketData.opportunityCostRate / 100);

      // Add opportunity cost to running totals
      cumulativeOpportunityCost += yearlyOpportunityCost;
      cumulativeInvestmentReserves += yearlyOpportunityCost;

      // Update cumulative costs
      cumulativeBuyingCosts += yearlyPropertyCosts;
      cumulativeRentalCosts += projection.rentalCosts;

      // Calculate house appreciation as current value minus original purchase price
      const houseAppreciation = projection.propertyValue - propertyDetails.purchasePrice;

      // Calculate potential sale costs
      const potentialSaleCosts = projection.propertyValue * 
                                (costStructure.futureSellCostsPercentage / 100);

      // Calculate net position comparing property investment vs renting and investing
      // Now includes the offset contributions in both scenarios:
      // - For buying: they reduce the effective loan balance (reflected in yearlyInterestPaid)
      // - For renting: they're added to the investment pool (reflected in cumulativeInvestmentReserves)
      const netPosition = -cumulativeOpportunityCost - cumulativeBuyingCosts - costStructure.purchaseCosts.total +
                        cumulativeRentalCosts + houseAppreciation - potentialSaleCosts;

      console.log(`Net Position Calculation:
        Year: ${projection.year}
        Cumulative Opportunity Cost: ${cumulativeOpportunityCost}
        Cumulative Rental Costs: ${cumulativeRentalCosts}
        Cumulative Buying Costs: ${cumulativeBuyingCosts}
         -- Yearly Mortgage Payment: ${yearlyMortgagePayment}
         -- Yearly Mortgage Cost: ${yearlyMortgageCost}
         -- Annual Property Costs: ${costStructure.annualPropertyCosts}
         -- CGT: ${projection.yearlyCGT}
        Yearly Cashflow: ${yearlyRentVsBuyCashFlow}
        Property Value: ${projection.propertyValue}
        House Appreciation: ${houseAppreciation}
        Original Loan Balance: ${projection.originalLoanBalance}
        Loan Balance: ${projection.loanBalance}
        Effective Loan Balance: ${projection.effectiveLoanBalance}
        Offset Amount: ${projection.offsetBalance}
        Interest Saved: ${projection.interestSaved}
        Cumulative Interest Saved: ${projection.cumulativeInterestSaved}
        Yearly Offset Contributions: ${projection.yearlyOffsetContributions}
        Cumulative Offset Contributions: ${projection.cumulativeOffsetContributions}
        Investment Reserves: ${cumulativeInvestmentReserves}
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
      breakEvenYear: breakEvenYear === -1 ? -1 : breakEvenYear,
      totalCostDifference,
      netPositionAtEnd: lastProjection.netPosition
    };
  }, [propertyDetails, marketData, costStructure, baseProjections]);
};
