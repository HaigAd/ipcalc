import { PropertyDetails, MarketData, CostStructure, YearlyProjection } from '../types';

export const calculateComparativeMetrics = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure,
  baseProjections: { 
    yearlyProjections: YearlyProjection[];
    offsetAmount: number;
  }
) => {
  const { yearlyProjections, offsetAmount } = baseProjections;
  const initialInvestment = propertyDetails.depositAmount + costStructure.purchaseCosts.total;
  let cumulativeInvestmentReserves = initialInvestment + offsetAmount;
  let cumulativeBuyingCosts = 0;
  let cumulativeRentalCosts = 0;
  let breakEvenYear = -1;
  let cumulativeOpportunityCost = 0;

  const updatedProjections = yearlyProjections.map(projection => {
    const yearlyMortgageCashflow = projection.yearlyPrincipalPaid + 
                                  (projection.effectiveLoanBalance * (propertyDetails.interestRate / 100));
    const yearlyMortgageCost = projection.effectiveLoanBalance * (propertyDetails.interestRate / 100);
    const yearlyPropertyCosts = yearlyMortgageCost + costStructure.annualPropertyCosts + projection.yearlyCGT;
    const yearlyPropertyCashflow = yearlyMortgageCashflow + costStructure.annualPropertyCosts;
    const yearlyRentVsBuyCashFlow = yearlyPropertyCashflow - projection.rentalCosts;

    cumulativeInvestmentReserves += yearlyRentVsBuyCashFlow;
    const yearlyOpportunityCost = cumulativeInvestmentReserves * (marketData.opportunityCostRate / 100);
    cumulativeOpportunityCost += yearlyOpportunityCost;
    cumulativeInvestmentReserves += yearlyOpportunityCost;
    cumulativeBuyingCosts += yearlyPropertyCosts;
    cumulativeRentalCosts += projection.rentalCosts;

    const houseAppreciation = projection.propertyValue - propertyDetails.depositAmount - projection.originalLoanBalance;
    const potentialSaleCosts = projection.propertyValue * (costStructure.futureSellCostsPercentage / 100);
    const netPosition = -cumulativeOpportunityCost - cumulativeBuyingCosts - costStructure.purchaseCosts.total +
                       cumulativeRentalCosts + houseAppreciation - potentialSaleCosts;

    if (breakEvenYear === -1 && netPosition >= 0) {
      breakEvenYear = projection.year;
    }

    return {
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
};
