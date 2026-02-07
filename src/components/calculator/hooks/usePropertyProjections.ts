import { useMemo } from 'react';
import { PropertyDetails, MarketData, YearlyProjection, CostStructure } from '../types';
import { calculateTaxBenefit, calculateTaxPayable } from '../calculations/taxCalculations';
import { 
  calculateMonthlyPayment, 
  getMonthlyContribution,
  calculateManagementFees
} from './projectionUtils';
import { getDepreciation } from '../utils/depreciation';
import {calculateYearlyRates} from '../utils/interest';

export const calculatePropertyProjections = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure,
  offsetAmount: number
) => {

    const principal = propertyDetails.purchasePrice - propertyDetails.depositAmount;
    // Calculate initial investment
    const initialInvestment = propertyDetails.depositAmount + costStructure.purchaseCosts.total;

    const interestRates = calculateYearlyRates(propertyDetails.interestRate, propertyDetails.loanTerm, propertyDetails.interestRateChanges);
    const anchorYear = marketData.currentValueYear;
    const anchorValue = marketData.currentPropertyValue;
    const anchorGrowthRate = anchorYear && anchorValue && anchorYear > 0 && anchorValue > 0
      ? (Math.pow(anchorValue / propertyDetails.purchasePrice, 1 / anchorYear) - 1) * 100
      : null;
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

    let cumulativeOperatingPosition = -costStructure.purchaseCosts.total; // Cumulative yearly costs less principal payments, but start at zero (so )
    let quarantinedLoss = 0;
    const negativeGearingStartYear = Math.max(1, Math.floor(propertyDetails.noNegativeGearingStartYear || 1));

    const initialMonthlyMortgagePayment = calculateMonthlyPayment(
      principal,
      interestRates[0],
      propertyDetails.loanTerm,
      propertyDetails.loanType
    );

    const initialSaleCost = costStructure.futureSellCostsPercentage / 100 * currentPropertyValue;
    const initialEquity = currentPropertyValue - loanBalance;
    const initialNetEquityAfterCGT = initialEquity;
    const initialNetPosition =
      initialNetEquityAfterCGT -
      cumulativePrincipalPaid +
      cumulativeOperatingPosition -
      propertyDetails.depositAmount -
      initialSaleCost;

    yearlyProjections.push({
      year: 0,
      propertyValue: currentPropertyValue,
      loanBalance,
      rentalIncome: 0,
      rentSavings: 0,
      offsetBalance: currentOffsetAmount,
      interestSaved: 0,
      cumulativeInterestSaved,
      effectiveLoanBalance: effectiveBalance,
      originalLoanBalance,
      yearlyPrincipalPaid: 0,
      cumulativePrincipalPaid,
      yearlyInterestPaid: 0,
      yearlyOffsetContributions: 0,
      cumulativeOffsetContributions,
      managementFees: 0,
      capitalWorksDepreciation: 0,
      plantEquipmentDepreciation: 0,
      totalDepreciation: 0,
      yearlyExpenses: 0,
      taxableIncome: 0,
      taxBenefit: 0,
      quarantinedLosses: quarantinedLoss,
      quarantinedLossesUsed: 0,
      cashFlow: 0,
      modelCashFlow: 0,
      equity: initialEquity,
      roi: 0,
      roiInitialInvestment: 0,
      capitalGain: 0,
      cgtPayable: 0,
      netEquityAfterCGT: initialNetEquityAfterCGT,
      cumulativeOperatingPosition,
      netPosition: initialNetPosition
    });

    const payoffThreshold = 0.01;
    for (let yearIndex = 0; yearIndex < propertyDetails.loanTerm; yearIndex++) {
        const projectionYear = yearIndex + 1;
        if (loanBalance <= payoffThreshold) {
          loanBalance = 0;
          isLoanPaidOff = true;
        }
        //Check interest rate for the year and determine monthly payments
        const monthlyMortgagePayment = calculateMonthlyPayment(
          noOffsetLoanBalance,
          interestRates[yearIndex],
          propertyDetails.loanTerm - yearIndex,
          propertyDetails.loanType
        );
        
        const monthlyRate = interestRates[yearIndex] / 100 / 12;

      const previousPropertyValue = currentPropertyValue;
      const rentSavings = propertyDetails.isPPOR ? annualRent : 0;
      const rentalIncomeForTax = propertyDetails.isPPOR ? 0 : annualRent;
      const modelIncome = propertyDetails.isPPOR ? rentSavings : rentalIncomeForTax;
      
      let yearlyOffsetContributions = 0;
      let yearlyInterestPaid = 0;
      let yearlyPrincipalPaid = 0;
      let yearlyNoOffsetInterest = 0;

      // Calculate monthly payments for more accurate compounding
      for (let month = 0; month < 12 && !isLoanPaidOff; month++) {
        if (loanBalance <= payoffThreshold) {
          loanBalance = 0;
          isLoanPaidOff = true;
          monthsToPayoff = currentMonth;
          break;
        }
        currentMonth++;
        
        // Add monthly contribution to offset
        yearlyOffsetContributions += monthlyContribution;
        currentOffsetAmount += monthlyContribution;
        
        // Calculate hypothetical loan payments (without offset)
        const noOffsetInterest = noOffsetLoanBalance * monthlyRate;
        const noOffsetPrincipal = propertyDetails.loanType === 'interest-only' ? 0 : 
          monthlyMortgagePayment - noOffsetInterest;
        const appliedNoOffsetPrincipal = Math.min(noOffsetPrincipal, noOffsetLoanBalance);
        noOffsetLoanBalance = Math.max(0, noOffsetLoanBalance - appliedNoOffsetPrincipal);
        yearlyNoOffsetInterest += noOffsetInterest;
        
        // Calculate actual payments with offset
        effectiveBalance = Math.max(0, loanBalance - currentOffsetAmount);
        const monthlyInterest = effectiveBalance * monthlyRate;
        const basePrincipalPaid = propertyDetails.loanType === 'interest-only' ? 0 : 
          monthlyMortgagePayment - monthlyInterest;
        const principalPaid = Math.min(basePrincipalPaid, loanBalance);
        
        // Update balances
        if (propertyDetails.loanType === 'principal-and-interest') {
          loanBalance = Math.max(0, loanBalance - principalPaid);
        }
        
        // Accumulate yearly totals
        yearlyInterestPaid += monthlyInterest;
        yearlyPrincipalPaid += principalPaid;

        // For P&I loans, check if loan is paid off
        // For IO loans, loan is never "paid off" as principal remains constant
        if (propertyDetails.loanType === 'principal-and-interest' && loanBalance <= payoffThreshold) {
          loanBalance = 0;
          isLoanPaidOff = true;
          monthsToPayoff = currentMonth;
        }
      }

      if (propertyDetails.loanType === 'principal-and-interest' && loanBalance <= payoffThreshold) {
        loanBalance = 0;
        isLoanPaidOff = true;
      }

      // Calculate interest saved and update running totals
      const yearlyInterestSaved = yearlyNoOffsetInterest - yearlyInterestPaid;
      cumulativeInterestSaved += yearlyInterestSaved;
      cumulativePrincipalPaid += yearlyPrincipalPaid;
      cumulativeOffsetContributions += yearlyOffsetContributions;

      // Calculate management fees based on rental income
      const managementFees = propertyDetails.isPPOR
        ? 0
        : calculateManagementFees(
            rentalIncomeForTax,
            propertyDetails.managementFee.type,
            propertyDetails.managementFee.value
          );

      // Get depreciation for this year
      const depreciation = propertyDetails.isPPOR
        ? { capitalWorks: 0, plantEquipment: 0 }
        : getDepreciation(propertyDetails.depreciationSchedule, projectionYear);
      const totalDepreciation = depreciation.capitalWorks + depreciation.plantEquipment;
      cumulativeDepreciation += totalDepreciation;

      // Calculate yearly expenses (including all costs)
      const yearlyExpenses = 
        yearlyInterestPaid +                   // Interest cost
        managementFees +                       // Property management
        currentAnnualPropertyCosts;            // Other property costs (maintenance, insurance, etc.) with growth

      // Calculate property income (rental income minus deductible expenses and depreciation) - tax purposes
      const propertyIncome = rentalIncomeForTax - 
                           yearlyExpenses - 
                           totalDepreciation;

      // Calculate tax benefit with optional loss quarantine.
      let taxablePropertyIncome = propertyIncome;
      let taxBenefit = 0;
      let quarantinedLossUsed = 0;
      const negativeGearingActive = propertyDetails.noNegativeGearing && projectionYear >= negativeGearingStartYear;
      if (!propertyDetails.isPPOR) {
        if (negativeGearingActive) {
          if (taxablePropertyIncome < 0) {
            quarantinedLoss += Math.abs(taxablePropertyIncome);
            taxablePropertyIncome = 0;
          } else if (quarantinedLoss > 0) {
            const offsetAmount = Math.min(quarantinedLoss, taxablePropertyIncome);
            quarantinedLoss -= offsetAmount;
            quarantinedLossUsed = offsetAmount;
            taxablePropertyIncome -= offsetAmount;
          }
          taxBenefit = calculateTaxBenefit(
            propertyDetails.taxableIncome,
            taxablePropertyIncome
          );
        } else {
          taxBenefit = calculateTaxBenefit(
            propertyDetails.taxableIncome,
            taxablePropertyIncome
          );
        }
      } else {
        taxablePropertyIncome = 0;
        taxBenefit = 0;
        quarantinedLossUsed = 0;
      }

      // Calculate cash flow (includes tax benefits)
      // For IO loans, no principal payments to deduct
      const effectiveTaxBenefit = propertyDetails.isPPOR ? 0 : taxBenefit;
      const effectiveTaxableIncome = propertyDetails.isPPOR ? 0 : propertyIncome;
      const effectiveQuarantinedLoss = propertyDetails.isPPOR ? 0 : quarantinedLoss;
      const effectiveQuarantinedLossUsed = propertyDetails.isPPOR ? 0 : quarantinedLossUsed;

      const cashIncome = propertyDetails.isPPOR ? 0 : rentSavings;
      const cashFlow = cashIncome - 
                      yearlyExpenses -
                      (propertyDetails.loanType === 'principal-and-interest' ? yearlyPrincipalPaid : 0) +
                      effectiveTaxBenefit;
      const modelCashFlow = modelIncome -
        yearlyExpenses -
        (propertyDetails.loanType === 'principal-and-interest' ? yearlyPrincipalPaid : 0) +
        effectiveTaxBenefit -
        yearlyOffsetContributions;

      // Update values for end-of-year growth (respect optional anchor)
      const correction = marketData.propertyValueCorrections?.find((item) => item.year === projectionYear);
      const propertyGrowthRate = correction
        ? correction.change
        : (anchorGrowthRate !== null && yearIndex < (anchorYear ?? 0)
          ? anchorGrowthRate
          : marketData.propertyGrowthRate);
      currentPropertyValue *= (1 + propertyGrowthRate / 100);
      annualRent *= (1 + marketData.rentIncreaseRate / 100);
      currentAnnualPropertyCosts *= (1 + marketData.operatingExpensesGrowthRate / 100);

      // Calculate equity position
      const equity = currentPropertyValue - loanBalance;

      // Calculate capital gain and CGT
      const capitalGain = currentPropertyValue - previousPropertyValue;
      
      const cgtDiscountRate = propertyDetails.useCustomCGTDiscount
        ? propertyDetails.cgtDiscountRate
        : 0.5;
      const taxableGainRate = Math.max(0, Math.min(1, 1 - cgtDiscountRate));

      const isPPOR = propertyDetails.isPPOR;
      const useSixYearRule = propertyDetails.isCGTExempt;

      // Calculate total invested capital (initial investment + cumulative principal + offset contributions)
      const totalInvestedCapital = initialInvestment + cumulativePrincipalPaid + cumulativeOffsetContributions;

      const saleCost =  costStructure.futureSellCostsPercentage / 100 * currentPropertyValue;
      // Calculate cumulative CGT for reporting purposes
      const costBase = propertyDetails.purchasePrice + 
                      costStructure.purchaseCosts.total + 
                      saleCost -
                      cumulativeDepreciation;
      
      let cumulativeCGTPayable = 0;
      if (!isPPOR && (!useSixYearRule || projectionYear > 6)) {
        const totalGain = currentPropertyValue - costBase;
        if (totalGain > 0) {
          const cgtLossOffset = negativeGearingActive ? Math.min(quarantinedLoss, totalGain) : 0;
          const adjustedGain = totalGain - cgtLossOffset;
          const discountedGain = adjustedGain * taxableGainRate;
          const baseIncome = propertyDetails.taxableIncome + taxablePropertyIncome;
          cumulativeCGTPayable = calculateTaxPayable(baseIncome + discountedGain) - calculateTaxPayable(baseIncome);
        }
      }
      
      // Calculate net equity after CGT (using cumulative CGT for equity calculation)
      const netEquityAfterCGT = equity - cumulativeCGTPayable;
      cumulativeOperatingPosition += modelIncome + effectiveTaxBenefit - yearlyExpenses;//
      const netPosition = netEquityAfterCGT - cumulativePrincipalPaid + cumulativeOperatingPosition - propertyDetails.depositAmount - saleCost;
      const roi = totalInvestedCapital > 0 ? (netPosition / totalInvestedCapital) * 100 : 0;
      const roiInitialInvestment = initialInvestment > 0 ? (netPosition / initialInvestment) * 100 : 0;
      yearlyProjections.push({
        year: projectionYear,
        propertyValue: currentPropertyValue,
        loanBalance,
        rentalIncome: rentalIncomeForTax,
        rentSavings,
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
        capitalWorksDepreciation: depreciation.capitalWorks,
        plantEquipmentDepreciation: depreciation.plantEquipment,
        totalDepreciation,
        yearlyExpenses,
        taxableIncome: effectiveTaxableIncome,
        taxBenefit: effectiveTaxBenefit,
        quarantinedLosses: effectiveQuarantinedLoss,
        quarantinedLossesUsed: effectiveQuarantinedLossUsed,
        cashFlow,
        modelCashFlow,
        equity,
        roi,
        roiInitialInvestment,
        capitalGain,
        cgtPayable: cumulativeCGTPayable, // Keep cumulative CGT for reporting
        netEquityAfterCGT,
        cumulativeOperatingPosition,
        netPosition: netPosition
      });
    }

    // Calculate years and months reduced from loan term
    // Only applicable for P&I loans
    const monthsReduced = propertyDetails.loanType === 'principal-and-interest' && monthsToPayoff > 0 ? 
      totalLoanMonths - monthsToPayoff : 0;
    const yearsReducedFromLoan = Math.floor(monthsReduced / 12);
    const monthsReducedFromLoan = monthsReduced % 12;

    // Calculate overall investment metrics
    const lastProjection = yearlyProjections[yearlyProjections.length - 1];
    const netPositionAtEnd = lastProjection.netEquityAfterCGT + lastProjection.cashFlow;
    const totalDepreciation = yearlyProjections.reduce((acc, curr) => acc + curr.totalDepreciation, 0);
    const roiProjections = yearlyProjections.filter((projection) => projection.year > 0);
    const averageROI = roiProjections.length > 0
      ? roiProjections.reduce((acc, curr) => acc + curr.roi, 0) / roiProjections.length
      : 0;

  return {
    yearlyProjections,
    initialMonthlyMortgagePayment,
    principal,
    totalInterestSaved: cumulativeInterestSaved,
    yearsReducedFromLoan,
    monthsReducedFromLoan,
    netPositionAtEnd,
    totalDepreciation,
    averageROI,
    finalCGTPayable: lastProjection.cgtPayable
  };
};

export const usePropertyProjections = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure,
  offsetAmount: number
) => {
  return useMemo(
    () => calculatePropertyProjections(propertyDetails, marketData, costStructure, offsetAmount),
    [propertyDetails, marketData, costStructure, offsetAmount]
  );
};
