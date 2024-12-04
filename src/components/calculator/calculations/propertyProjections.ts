import { PropertyDetails, MarketData, YearlyProjection } from '../types';

export const calculatePropertyProjections = (propertyDetails: PropertyDetails, marketData: MarketData) => {
  const principal = propertyDetails.purchasePrice - propertyDetails.depositAmount;
  const monthlyRate = (propertyDetails.interestRate / 100) / 12;
  const totalMonths = propertyDetails.loanTerm * 12;
  const monthlyMortgagePayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                                (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const yearlyProjections: YearlyProjection[] = [];
  let currentPropertyValue = propertyDetails.purchasePrice;
  let loanBalance = principal;
  let annualRent = propertyDetails.weeklyRent * 52;
  let cumulativePrincipalPaid = 0;

  for (let year = 1; year <= propertyDetails.loanTerm; year++) {
    const yearlyInterestCost = loanBalance * (propertyDetails.interestRate / 100);
    const yearlyPrincipalPaid = (monthlyMortgagePayment * 12) - yearlyInterestCost;
    loanBalance = Math.max(0, loanBalance - yearlyPrincipalPaid);
    cumulativePrincipalPaid += yearlyPrincipalPaid;
    currentPropertyValue *= (1 + marketData.propertyGrowthRate / 100);
    annualRent *= (1 + marketData.rentIncreaseRate / 100);

    yearlyProjections.push({
      year,
      propertyValue: currentPropertyValue,
      loanBalance,
      totalCosts: 0,
      rentalCosts: annualRent,
      netPosition: 0,
      cumulativeBuyingCosts: 0,
      cumulativeRentalCosts: 0,
      yearlyOpportunityCost: 0,
      cumulativeOpportunityCost: 0,
      offsetBalance: 0,
      interestSaved: 0,
      cumulativeInterestSaved: 0,
      effectiveLoanBalance: loanBalance,
      originalLoanBalance: principal,
      existingPPORValue: 0,
      yearlyCGT: 0,
      yearlyPrincipalPaid,
      cumulativePrincipalPaid,
      yearlyPrincipalSavingsOpportunityCost: 0,
      cumulativePrincipalSavingsOpportunityCost: 0,
      yearlyRentVsBuyCashFlow: 0,
      cumulativeInvestmentReserves: 0
    });
  }

  return { yearlyProjections, monthlyMortgagePayment, principal };
};
