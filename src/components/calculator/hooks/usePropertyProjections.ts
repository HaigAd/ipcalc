import { useMemo } from 'react';
import { PropertyDetails, MarketData, YearlyProjection } from '../types';

const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
  const monthlyRate = (annualRate / 100) / 12;
  const totalMonths = years * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
         (Math.pow(1 + monthlyRate, totalMonths) - 1);
};

export const usePropertyProjections = (
  propertyDetails: PropertyDetails,
  marketData: MarketData
) => {
  return useMemo(() => {
    const principal = propertyDetails.purchasePrice - propertyDetails.depositAmount;
    const monthlyMortgagePayment = calculateMonthlyPayment(
      principal,
      propertyDetails.interestRate,
      propertyDetails.loanTerm
    );

    const yearlyProjections: YearlyProjection[] = [];
    let currentPropertyValue = propertyDetails.purchasePrice;
    let loanBalance = principal;
    let annualRent = propertyDetails.weeklyRent * 52;
    let cumulativePrincipalPaid = 0;

    for (let year = 1; year <= propertyDetails.loanTerm; year++) {
      // Calculate yearly interest and principal payments
      const yearlyInterestCost = loanBalance * (propertyDetails.interestRate / 100);
      const yearlyPrincipalPaid = (monthlyMortgagePayment * 12) - yearlyInterestCost;
      loanBalance = Math.max(0, loanBalance - yearlyPrincipalPaid);
      
      // Update cumulative principal paid
      cumulativePrincipalPaid += yearlyPrincipalPaid;

      // Calculate property appreciation
      currentPropertyValue *= (1 + marketData.propertyGrowthRate / 100);
      
      // Calculate rent increase
      annualRent *= (1 + marketData.rentIncreaseRate / 100);

      yearlyProjections.push({
        year,
        propertyValue: currentPropertyValue,
        loanBalance,
        totalCosts: 0, // Will be calculated by useComparativeMetrics
        rentalCosts: annualRent,
        netPosition: 0, // Will be calculated by useComparativeMetrics
        cumulativeBuyingCosts: 0, // Will be calculated by useComparativeMetrics
        cumulativeRentalCosts: 0, // Will be calculated by useComparativeMetrics
        yearlyOpportunityCost: 0, // Will be calculated by useComparativeMetrics
        offsetBalance: 0, // Will be set by useOffsetCalculations
        interestSaved: 0, // Will be set by useOffsetCalculations
        cumulativeInterestSaved: 0, // Will be set by useOffsetCalculations
        effectiveLoanBalance: loanBalance, // Will be updated by useOffsetCalculations
        originalLoanBalance: principal,
        existingPPORValue: 0, // Will be set by useCGTCalculations
        yearlyCGT: 0, // Will be set by useCGTCalculations
        yearlyPrincipalPaid, // Principal paid this year
        cumulativePrincipalPaid, // Total principal paid
        yearlyPrincipalSavingsOpportunityCost: 0, // Will be calculated by useComparativeMetrics
        cumulativePrincipalSavingsOpportunityCost: 0 // Will be calculated by useComparativeMetrics
      });
    }

    return {
      yearlyProjections,
      monthlyMortgagePayment,
      principal
    };
  }, [propertyDetails, marketData]);
};
