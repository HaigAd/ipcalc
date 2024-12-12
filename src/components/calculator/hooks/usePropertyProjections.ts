import { useMemo } from 'react';
import { PropertyDetails, MarketData, YearlyProjection, CostStructure } from '../types';
import { calculateTaxBenefit, getTaxBracket } from '../calculations/taxCalculations';
import { 
  calculateMonthlyPayment, 
  getMonthlyContribution,
  calculateManagementFees,
  calculateTotalDepreciation
} from './projectionUtils';

export const usePropertyProjections = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure,
  offsetAmount: number
) => {
  return useMemo(() => {
    const principal = propertyDetails.purchasePrice - propertyDetails.depositAmount;
    const monthlyMortgagePayment = calculateMonthlyPayment(
      principal,
      propertyDetails.interestRate,
      propertyDetails.loanTerm
    );

    // Calculate initial investment
    const initialInvestment = propertyDetails.depositAmount + costStructure.purchaseCosts.total;

    const yearlyProjections: YearlyProjection[] = [];
    let currentPropertyValue = propertyDetails.purchasePrice;
    let annualRent = propertyDetails.investmentRent * 52;
    let currentAnnualPropertyCosts = costStructure.annualPropertyCosts;
    let cumulativePrincipalPaid = 0;
    let cumulativeInterestSaved = 0;
    let cumulativeOffsetContributions = 0;
    let cumulativeDepreciation = 0;
    let isLoanPaidOff = false;
    let monthsToPayoff = 0;

    const monthlyRate = propertyDetails.interestRate / 100 / 12;
    const totalLoanMonths = propertyDetails.loanTerm * 12;
    let currentMonth = 0;

    // Initialize loan balances
    let loanBalance = principal;
    let currentOffsetAmount = offsetAmount;
    let effectiveBalance = Math.max(0, loanBalance - currentOffsetAmount);
    const originalLoanBalance = principal;
    let noOffsetLoanBalance = principal;

    // Calculate monthly contribution
    const monthlyContribution = getMonthlyContribution(propertyDetails.offsetContribution);

    for (let year = 1; year <= propertyDetails.loanTerm; year++) {
      const previousPropertyValue = currentPropertyValue;
      
      // Calculate property appreciation, rent increase, and operating expenses growth at the start of each year
      currentPropertyValue *= (1 + marketData.propertyGrowthRate / 100);
      annualRent *= (1 + marketData.rentIncreaseRate / 100);
      currentAnnualPropertyCosts *= (1 + marketData.operatingExpensesGrowthRate / 100);

      let yearlyOffsetContributions = 0;
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

      // Calculate management fees based on rental income
      const managementFees = calculateManagementFees(
        annualRent,
        propertyDetails.managementFee.type,
        propertyDetails.managementFee.value
      );

      // Calculate depreciation
      const totalDepreciation = calculateTotalDepreciation(
        propertyDetails.capitalWorksDepreciation,
        propertyDetails.plantEquipmentDepreciation
      );
      cumulativeDepreciation += totalDepreciation;

      // Calculate yearly expenses (including all costs)
      const yearlyExpenses = 
        yearlyInterestPaid +                   // Interest cost
        managementFees +                       // Property management
        currentAnnualPropertyCosts;            // Other property costs (maintenance, insurance, etc.) with growth

      // Calculate property income (rental income minus deductible expenses and depreciation)
      const propertyIncome = annualRent - 
                           yearlyExpenses - 
                           totalDepreciation;

      // Calculate tax benefit using the imported function
      const taxBenefit = calculateTaxBenefit(
        propertyDetails.taxableIncome,
        propertyIncome
      );

      // Calculate cash flow (includes tax benefits)
      const cashFlow = annualRent - 
                      yearlyExpenses -
                      yearlyPrincipalPaid +    // Principal payments aren't tax deductible
                      taxBenefit;

      // Calculate equity position
      const equity = currentPropertyValue - loanBalance;

      // Calculate capital gain and CGT
      const capitalGain = currentPropertyValue - previousPropertyValue;
      
      let yearlyCGTPayable = 0;
      if (!propertyDetails.isCGTExempt || year > 6) {
        // Calculate CGT on this year's gain only
        if (capitalGain > 0) {
          // 50% discount on capital gains
          const discountedGain = capitalGain * 0.5;
          // Get the actual tax bracket for the total income
          const taxBracket = getTaxBracket(propertyDetails.taxableIncome + propertyIncome);
          if (taxBracket) {
            yearlyCGTPayable = discountedGain * (taxBracket.rate + 0.02); // Include Medicare levy
          }
        }
      }

      // Calculate total invested capital (initial investment + cumulative principal + offset contributions)
      const totalInvestedCapital = initialInvestment + cumulativePrincipalPaid + cumulativeOffsetContributions;

      // Calculate ROI for this year using yearly capital gain and yearly CGT
      const roi = ((annualRent - yearlyExpenses + taxBenefit + capitalGain - yearlyCGTPayable) / totalInvestedCapital) * 100;

      // Calculate cumulative CGT for reporting purposes
      const costBase = propertyDetails.purchasePrice + 
                      costStructure.purchaseCosts.total + 
                      costStructure.futureSellCosts - 
                      cumulativeDepreciation;
      
      let cumulativeCGTPayable = 0;
      if (!propertyDetails.isCGTExempt || year > 6) {
        const totalGain = currentPropertyValue - costBase;
        if (totalGain > 0) {
          const discountedGain = totalGain * 0.5;
          const taxBracket = getTaxBracket(propertyDetails.taxableIncome + propertyIncome);
          if (taxBracket) {
            cumulativeCGTPayable = discountedGain * (taxBracket.rate + 0.02);
          }
        }
      }

      // Calculate net equity after CGT (using cumulative CGT for equity calculation)
      const netEquityAfterCGT = equity - cumulativeCGTPayable;

      yearlyProjections.push({
        year,
        propertyValue: currentPropertyValue,
        loanBalance,
        rentalIncome: annualRent,
        offsetBalance: currentOffsetAmount,
        interestSaved: yearlyInterestSaved,
        cumulativeInterestSaved,
        effectiveLoanBalance: effectiveBalance,
        originalLoanBalance,
        yearlyPrincipalPaid,
        cumulativePrincipalPaid,
        yearlyInterestPaid,
        yearlyOffsetContributions,
        cumulativeOffsetContributions,
        managementFees,
        capitalWorksDepreciation: propertyDetails.capitalWorksDepreciation,
        plantEquipmentDepreciation: propertyDetails.plantEquipmentDepreciation,
        totalDepreciation,
        yearlyExpenses,
        taxableIncome: propertyIncome,
        taxBenefit,
        cashFlow,
        equity,
        roi,
        capitalGain,
        cgtPayable: cumulativeCGTPayable, // Keep cumulative CGT for reporting
        netEquityAfterCGT
      });
    }

    // Calculate years and months reduced from loan term
    const monthsReduced = monthsToPayoff > 0 ? totalLoanMonths - monthsToPayoff : 0;
    const yearsReducedFromLoan = Math.floor(monthsReduced / 12);
    const monthsReducedFromLoan = monthsReduced % 12;

    // Calculate overall investment metrics
    const lastProjection = yearlyProjections[yearlyProjections.length - 1];
    const netPositionAtEnd = lastProjection.netEquityAfterCGT + lastProjection.cashFlow;
    const totalDepreciation = lastProjection.totalDepreciation * yearlyProjections.length;
    const averageROI = yearlyProjections.reduce((acc, curr) => acc + curr.roi, 0) / yearlyProjections.length;

    return {
      yearlyProjections,
      monthlyMortgagePayment,
      principal,
      totalInterestSaved: cumulativeInterestSaved,
      yearsReducedFromLoan,
      monthsReducedFromLoan,
      netPositionAtEnd,
      totalDepreciation,
      averageROI,
      finalCGTPayable: lastProjection.cgtPayable
    };
  }, [propertyDetails, marketData, costStructure, offsetAmount]);
};
