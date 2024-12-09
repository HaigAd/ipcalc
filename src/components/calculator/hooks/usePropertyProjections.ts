import { useMemo } from 'react';
import { PropertyDetails, MarketData, YearlyProjection } from '../types';

const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
  const monthlyRate = (annualRate / 100) / 12;
  const totalMonths = years * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
         (Math.pow(1 + monthlyRate, totalMonths) - 1);
};

const getMonthlyContribution = (offsetContribution: PropertyDetails['offsetContribution']) => {
  // Handle case where offsetContribution might be undefined (backward compatibility)
  if (!offsetContribution) {
    return 0;
  }

  const { amount, frequency } = offsetContribution;
  switch (frequency) {
    case 'weekly':
      return (amount * 52) / 12;
    case 'yearly':
      return amount / 12;
    case 'monthly':
    default:
      return amount;
  }
};

export const usePropertyProjections = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  offsetAmount: number
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
    let annualRent = propertyDetails.weeklyRent * 52;
    let cumulativePrincipalPaid = 0;
    let cumulativeInterestSaved = 0;
    let cumulativeOffsetContributions = 0;
    let isLoanPaidOff = false;
    let monthsToPayoff = 0;

    const monthlyRate = propertyDetails.interestRate / 100 / 12;
    const totalLoanMonths = propertyDetails.loanTerm * 12;
    let currentMonth = 0;

    // Initialize loan balances
    let loanBalance = principal;
    let currentOffsetAmount = offsetAmount;
    let effectiveBalance = Math.max(0, loanBalance - currentOffsetAmount);
    const originalLoanBalance = principal; // The actual initial loan amount, never changes
    let noOffsetLoanBalance = principal; // Tracks hypothetical loan balance without offset

    // Calculate monthly contribution
    const monthlyContribution = getMonthlyContribution(propertyDetails.offsetContribution);

    for (let year = 1; year <= propertyDetails.loanTerm; year++) {
      // Calculate property appreciation and rent increase at the start of each year
      currentPropertyValue *= (1 + marketData.propertyGrowthRate / 100);
      annualRent *= (1 + marketData.rentIncreaseRate / 100);

      let yearlyOffsetContributions = 0;

      // If loan is already paid off, only track no-offset scenario for interest saved calculation
      if (isLoanPaidOff) {
        // Calculate interest that would have been paid without offset
        let yearlyNoOffsetInterest = 0;
        for (let month = 0; month < 12; month++) {
          const noOffsetInterest = noOffsetLoanBalance * monthlyRate;
          const noOffsetPrincipal = monthlyMortgagePayment - noOffsetInterest;
          noOffsetLoanBalance = Math.max(0, noOffsetLoanBalance - noOffsetPrincipal);
          yearlyNoOffsetInterest += noOffsetInterest;

          // Still track contributions even after loan payoff
          yearlyOffsetContributions += monthlyContribution;
          currentOffsetAmount += monthlyContribution;
        }

        // All of this interest is saved since loan is paid off
        cumulativeInterestSaved += yearlyNoOffsetInterest;
        cumulativeOffsetContributions += yearlyOffsetContributions;

        yearlyProjections.push({
          year,
          propertyValue: currentPropertyValue,
          loanBalance: 0,
          totalCosts: 0,
          rentalCosts: annualRent,
          netPosition: 0,
          cumulativeBuyingCosts: 0,
          cumulativeRentalCosts: 0,
          yearlyOpportunityCost: 0,
          cumulativeOpportunityCost: 0,
          offsetBalance: currentOffsetAmount,
          interestSaved: yearlyNoOffsetInterest,
          cumulativeInterestSaved,
          effectiveLoanBalance: 0,
          originalLoanBalance,
          existingPPORValue: 0,
          yearlyCGT: 0,
          yearlyPrincipalPaid: 0,
          cumulativePrincipalPaid,
          yearlyPrincipalSavingsOpportunityCost: 0,
          cumulativePrincipalSavingsOpportunityCost: 0,
          yearlyRentVsBuyCashFlow: 0,
          cumulativeInvestmentReserves: 0,
          yearlyInterestPaid: 0,
          yearlyOffsetContributions,
          cumulativeOffsetContributions
        });

        continue;
      }

      let yearlyInterestPaid = 0;
      let yearlyPrincipalPaid = 0;
      let yearlyNoOffsetInterest = 0;

      // Calculate monthly payments for more accurate compounding
      for (let month = 0; month < 12 && !isLoanPaidOff; month++) {
        currentMonth++;
        
        // Add monthly contribution to offset
        yearlyOffsetContributions += monthlyContribution;
        currentOffsetAmount += monthlyContribution;
        
        // Calculate hypothetical loan payments (without offset)
        const noOffsetInterest = noOffsetLoanBalance * monthlyRate;
        const noOffsetPrincipal = monthlyMortgagePayment - noOffsetInterest;
        noOffsetLoanBalance = Math.max(0, noOffsetLoanBalance - noOffsetPrincipal);
        yearlyNoOffsetInterest += noOffsetInterest;
        
        // Calculate actual payments with offset
        effectiveBalance = Math.max(0, loanBalance - currentOffsetAmount);
        const monthlyInterest = effectiveBalance * monthlyRate;
        const principalPaid = monthlyMortgagePayment - monthlyInterest;
        
        // Update balances
        loanBalance = Math.max(0, loanBalance - principalPaid);
        
        // Accumulate yearly totals
        yearlyInterestPaid += monthlyInterest;
        yearlyPrincipalPaid += principalPaid;

        if (loanBalance === 0) {
          isLoanPaidOff = true;
          monthsToPayoff = currentMonth;
        }
      }

      // Calculate interest saved and update running totals
      const yearlyInterestSaved = yearlyNoOffsetInterest - yearlyInterestPaid;
      cumulativeInterestSaved += yearlyInterestSaved;
      cumulativePrincipalPaid += yearlyPrincipalPaid;
      cumulativeOffsetContributions += yearlyOffsetContributions;

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
        offsetBalance: currentOffsetAmount,
        interestSaved: yearlyInterestSaved,
        cumulativeInterestSaved,
        effectiveLoanBalance: effectiveBalance,
        originalLoanBalance,
        existingPPORValue: 0,
        yearlyCGT: 0,
        yearlyPrincipalPaid,
        cumulativePrincipalPaid,
        yearlyPrincipalSavingsOpportunityCost: 0,
        cumulativePrincipalSavingsOpportunityCost: 0,
        yearlyRentVsBuyCashFlow: 0,
        cumulativeInvestmentReserves: 0,
        yearlyInterestPaid,
        yearlyOffsetContributions,
        cumulativeOffsetContributions
      });
    }

    // Calculate years and months reduced
    const monthsReduced = monthsToPayoff > 0 ? totalLoanMonths - monthsToPayoff : 0;
    const yearsReducedFromLoan = Math.floor(monthsReduced / 12);
    const monthsReducedFromLoan = monthsReduced % 12;

    return {
      yearlyProjections,
      monthlyMortgagePayment,
      principal,
      totalInterestSaved: cumulativeInterestSaved,
      yearsReducedFromLoan,
      monthsReducedFromLoan
    };
  }, [propertyDetails, marketData, offsetAmount]);
};
