import { useMemo } from 'react';
import { PropertyDetails, MarketData, YearlyProjection, CostStructure } from '../types';
import { calculateTaxBenefit, calculateTaxPayable, getTaxBracket } from '../calculations/taxCalculations';
import { 
  calculateMonthlyPayment, 
  getMonthlyContribution,
  calculateManagementFees,
  calculateTotalDepreciation
} from './projectionUtils';
import { getDepreciation } from '../utils/depreciation';
import {calculateYearlyRates} from '../utils/interest';

export const usePropertyProjections = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure,
  offsetAmount: number
) => {
  return useMemo(() => {
    const computeIrr = (cashFlows: number[]) => {
      if (cashFlows.length < 2) return null;
      const hasPositive = cashFlows.some((value) => value > 0);
      const hasNegative = cashFlows.some((value) => value < 0);
      if (!hasPositive || !hasNegative) return null;

      const npv = (rate: number) =>
        cashFlows.reduce((total, value, index) => total + value / Math.pow(1 + rate, index), 0);

      let low = -0.999;
      let high = 1;
      let npvLow = npv(low);
      let npvHigh = npv(high);
      let guard = 0;

      while (npvLow * npvHigh > 0 && guard < 50) {
        high *= 2;
        npvHigh = npv(high);
        guard += 1;
      }

      if (npvLow * npvHigh > 0) return null;

      for (let i = 0; i < 100; i++) {
        const mid = (low + high) / 2;
        const npvMid = npv(mid);
        if (Math.abs(npvMid) < 1e-6) {
          return mid;
        }
        if (npvLow * npvMid < 0) {
          high = mid;
          npvHigh = npvMid;
        } else {
          low = mid;
          npvLow = npvMid;
        }
      }

      return (low + high) / 2;
    };

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
    let cumulativeCapitalGain = 0;
    const cashFlows: number[] = [-initialInvestment];
    let quarantinedLoss = 0;
    const negativeGearingStartYear = Math.max(1, Math.floor(propertyDetails.noNegativeGearingStartYear || 1));

    const initialMonthlyMortgagePayment = calculateMonthlyPayment(
      principal,
      interestRates[0],
      propertyDetails.loanTerm,
      propertyDetails.loanType
    );

    for (let year = 0; year < propertyDetails.loanTerm; year++) {
        //Check interest rate for the year and determine monthly payments
        const monthlyMortgagePayment = calculateMonthlyPayment(
          noOffsetLoanBalance,
          interestRates[year],
          propertyDetails.loanTerm - year,
          propertyDetails.loanType
        );
        
        const monthlyRate = interestRates[year] / 100 / 12;

      const previousPropertyValue = currentPropertyValue;
      const yearRentalIncome = annualRent;
      
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
        const noOffsetPrincipal = propertyDetails.loanType === 'interest-only' ? 0 : 
          monthlyMortgagePayment - noOffsetInterest;
        noOffsetLoanBalance = Math.max(0, noOffsetLoanBalance - noOffsetPrincipal);
        yearlyNoOffsetInterest += noOffsetInterest;
        
        // Calculate actual payments with offset
        effectiveBalance = Math.max(0, loanBalance - currentOffsetAmount);
        const monthlyInterest = effectiveBalance * monthlyRate;
        const principalPaid = propertyDetails.loanType === 'interest-only' ? 0 : 
          monthlyMortgagePayment - monthlyInterest;
        
        // Update balances
        if (propertyDetails.loanType === 'principal-and-interest') {
          loanBalance = Math.max(0, loanBalance - principalPaid);
        }
        
        // Accumulate yearly totals
        yearlyInterestPaid += monthlyInterest;
        yearlyPrincipalPaid += principalPaid;

        // For P&I loans, check if loan is paid off
        // For IO loans, loan is never "paid off" as principal remains constant
        if (propertyDetails.loanType === 'principal-and-interest' && loanBalance === 0) {
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
        yearRentalIncome,
        propertyDetails.managementFee.type,
        propertyDetails.managementFee.value
      );

      // Get depreciation for this year
      const depreciation = getDepreciation(propertyDetails.depreciationSchedule, year + 1);
      const totalDepreciation = depreciation.capitalWorks + depreciation.plantEquipment;
      cumulativeDepreciation += totalDepreciation;

      // Calculate yearly expenses (including all costs)
      const yearlyExpenses = 
        yearlyInterestPaid +                   // Interest cost
        managementFees +                       // Property management
        currentAnnualPropertyCosts;            // Other property costs (maintenance, insurance, etc.) with growth

      // Calculate property income (rental income minus deductible expenses and depreciation) - tax purposes
      const propertyIncome = yearRentalIncome - 
                           yearlyExpenses - 
                           totalDepreciation;

      // Calculate tax benefit with optional loss quarantine.
      let taxablePropertyIncome = propertyIncome;
      let taxBenefit = 0;
      let quarantinedLossUsed = 0;
      const negativeGearingActive = propertyDetails.noNegativeGearing && (year + 1) >= negativeGearingStartYear;
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

      // Calculate cash flow (includes tax benefits)
      // For IO loans, no principal payments to deduct
      const cashFlow = yearRentalIncome - 
                      yearlyExpenses -
                      (propertyDetails.loanType === 'principal-and-interest' ? yearlyPrincipalPaid : 0) +
                      taxBenefit;

      // Update values for end-of-year growth (respect optional anchor)
      const correction = marketData.propertyValueCorrections?.find((item) => item.year === year + 1);
      const propertyGrowthRate = correction
        ? correction.change
        : (anchorGrowthRate !== null && year < anchorYear
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

      let yearlyCGTPayable = 0;
      const isPPOR = propertyDetails.isPPOR;
      const useSixYearRule = propertyDetails.isCGTExempt;
      if (!isPPOR && (!useSixYearRule || year + 1 > 6)) {
        cumulativeCapitalGain += capitalGain;
        // Calculate CGT on this year's gain only
        if (capitalGain > 0) {
          // Apply CGT discount to get the taxable portion of the gain.
          const discountedGain = capitalGain * taxableGainRate;
          // Get the actual tax bracket for the total income
          const taxBracket = getTaxBracket(
            propertyDetails.taxableIncome + taxablePropertyIncome + (cumulativeCapitalGain * taxableGainRate)
          );
          if (taxBracket) {
            yearlyCGTPayable = discountedGain * (taxBracket.rate + 0.02); // Include Medicare levy
          }
        }
      }

      // Calculate total invested capital (initial investment + cumulative principal + offset contributions)
      const totalInvestedCapital = initialInvestment + cumulativePrincipalPaid + cumulativeOffsetContributions;

      const saleCost =  costStructure.futureSellCostsPercentage / 100 * currentPropertyValue;
      // Calculate cumulative CGT for reporting purposes
      const costBase = propertyDetails.purchasePrice + 
                      costStructure.purchaseCosts.total + 
                      saleCost -
                      cumulativeDepreciation;
      
      let cumulativeCGTPayable = 0;
      if (!isPPOR && (!useSixYearRule || year + 1 > 6)) {
        const totalGain = currentPropertyValue - costBase;
        if (totalGain > 0) {
          const cgtLossOffset = negativeGearingActive ? Math.min(quarantinedLoss, totalGain) : 0;
          const adjustedGain = totalGain - cgtLossOffset;
          const discountedGain = adjustedGain * taxableGainRate;
          const taxBracket = getTaxBracket(propertyDetails.taxableIncome + taxablePropertyIncome);
          if (taxBracket) {
            cumulativeCGTPayable = discountedGain * (taxBracket.rate + 0.02);
          }
        }
      }
      
      // Calculate net equity after CGT (using cumulative CGT for equity calculation)
      const netEquityAfterCGT = equity - cumulativeCGTPayable;
      cumulativeOperatingPosition += yearRentalIncome + taxBenefit - yearlyExpenses;//
      const netPosition = netEquityAfterCGT - cumulativePrincipalPaid + cumulativeOperatingPosition - propertyDetails.depositAmount - saleCost;
      const roi = totalInvestedCapital > 0 ? (netPosition / totalInvestedCapital) * 100 : 0;
      const roiInitialInvestment = initialInvestment > 0 ? (netPosition / initialInvestment) * 100 : 0;
      cashFlows.push(cashFlow);
      const irrFlows = cashFlows.slice();
      irrFlows[irrFlows.length - 1] += netEquityAfterCGT - saleCost;
      const irrRate = computeIrr(irrFlows);
      yearlyProjections.push({
        year,
        propertyValue: currentPropertyValue,
        loanBalance,
        rentalIncome: yearRentalIncome,
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
        taxableIncome: propertyIncome,
        taxBenefit,
        quarantinedLosses: quarantinedLoss,
        quarantinedLossesUsed: quarantinedLossUsed,
        cashFlow,
        equity,
        roi,
        roiInitialInvestment,
        irr: irrRate !== null ? irrRate * 100 : undefined,
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
    const averageROI = yearlyProjections.length > 0
      ? yearlyProjections.reduce((acc, curr) => acc + curr.roi, 0) / yearlyProjections.length
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
  }, [propertyDetails, marketData, costStructure, offsetAmount]);
};
