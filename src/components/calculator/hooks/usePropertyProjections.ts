import { useMemo } from 'react';
import { PropertyDetails, MarketData, YearlyProjection, CostStructure } from '../types';

// Australian tax brackets for 2023-2024
const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.19, base: 0 },
  { min: 45001, max: 120000, rate: 0.325, base: 5092 },
  { min: 120001, max: 180000, rate: 0.37, base: 29467 },
  { min: 180001, max: Infinity, rate: 0.45, base: 51667 }
];

const calculateTaxBenefit = (taxableIncome: number, negativeIncome: number) => {
  const bracket = TAX_BRACKETS.find(b => 
    taxableIncome >= b.min && taxableIncome <= b.max
  );
  
  if (!bracket || negativeIncome >= 0) return 0;
  
  // Calculate tax savings based on marginal rate and base amount
  const taxOnIncome = (taxableIncome - bracket.min) * bracket.rate + bracket.base;
  const taxOnReducedIncome = (taxableIncome + negativeIncome - bracket.min) * bracket.rate + bracket.base;
  return taxOnIncome - taxOnReducedIncome;
};

const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
  const monthlyRate = (annualRate / 100) / 12;
  const totalMonths = years * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
         (Math.pow(1 + monthlyRate, totalMonths) - 1);
};

const getMonthlyContribution = (offsetContribution: PropertyDetails['offsetContribution']) => {
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
    const originalLoanBalance = principal;
    let noOffsetLoanBalance = principal;

    // Calculate monthly contribution
    const monthlyContribution = getMonthlyContribution(propertyDetails.offsetContribution);

    for (let year = 1; year <= propertyDetails.loanTerm; year++) {
      const previousPropertyValue = currentPropertyValue;
      
      // Calculate property appreciation and rent increase at the start of each year
      currentPropertyValue *= (1 + marketData.propertyGrowthRate / 100);
      annualRent *= (1 + marketData.rentIncreaseRate / 100);

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
      const managementFees = propertyDetails.managementFee.type === 'percentage'
        ? (annualRent * propertyDetails.managementFee.value / 100)
        : propertyDetails.managementFee.value;

      // Calculate depreciation
      const capitalWorksDepreciation = propertyDetails.capitalWorksDepreciation;
      const plantEquipmentDepreciation = propertyDetails.plantEquipmentDepreciation;
      const totalDepreciation = capitalWorksDepreciation + plantEquipmentDepreciation;

      // Calculate yearly expenses (including all costs)
      const yearlyExpenses = 
        yearlyInterestPaid +                   // Interest cost
        managementFees +                       // Property management
        costStructure.annualPropertyCosts;     // Other property costs (maintenance, insurance, etc.)

      // Calculate taxable income (rental income minus deductible expenses and depreciation)
      const taxableIncome = annualRent - 
                           yearlyExpenses - 
                           totalDepreciation;

      // Calculate tax benefit if negatively geared
      const taxBenefit = calculateTaxBenefit(
        propertyDetails.taxableIncome,
        taxableIncome
      );

      // Calculate cash flow (includes tax benefits)
      const cashFlow = annualRent - 
                      yearlyExpenses -
                      yearlyPrincipalPaid +    // Principal payments aren't tax deductible
                      taxBenefit;

      // Calculate equity position
      const equity = currentPropertyValue - loanBalance;

      // Calculate equity gain from previous year
      const equityGain = currentPropertyValue - previousPropertyValue;

      // Calculate total invested capital (initial investment + cumulative principal + offset contributions)
      const totalInvestedCapital = initialInvestment + cumulativePrincipalPaid + cumulativeOffsetContributions;

      // Calculate ROI for this year (Cash Flow + Equity Gain) / Total Invested Capital
      const roi = ((cashFlow + equityGain) / totalInvestedCapital) * 100;

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
        capitalWorksDepreciation,
        plantEquipmentDepreciation,
        totalDepreciation,
        yearlyExpenses,
        taxableIncome,
        taxBenefit,
        cashFlow,
        equity,
        roi
      });
    }

    // Calculate years and months reduced from loan term
    const monthsReduced = monthsToPayoff > 0 ? totalLoanMonths - monthsToPayoff : 0;
    const yearsReducedFromLoan = Math.floor(monthsReduced / 12);
    const monthsReducedFromLoan = monthsReduced % 12;

    // Calculate overall investment metrics
    const lastProjection = yearlyProjections[yearlyProjections.length - 1];
    const netPositionAtEnd = lastProjection.equity + lastProjection.cashFlow;
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
      averageROI
    };
  }, [propertyDetails, marketData, costStructure, offsetAmount]);
};
