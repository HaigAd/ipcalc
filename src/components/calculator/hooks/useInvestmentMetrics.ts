import { useMemo } from 'react';
import { CostStructure, YearlyProjection, PropertyDetails, MarketData } from '../types';

// Australian tax brackets for 2023-2024
const TAX_BRACKETS = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.19, base: 0 },
  { min: 45001, max: 120000, rate: 0.325, base: 5092 },
  { min: 120001, max: 180000, rate: 0.37, base: 29467 },
  { min: 180001, max: Infinity, rate: 0.45, base: 51667 }
];

const calculateTaxBenefit = (taxableIncome: number, negativeIncome: number) => {
  // Find applicable tax bracket
  const bracket = TAX_BRACKETS.find(b => 
    taxableIncome >= b.min && taxableIncome <= b.max
  );
  
  if (!bracket || negativeIncome >= 0) return 0;
  
  // Calculate tax benefit at marginal rate
  return Math.abs(negativeIncome) * bracket.rate;
};

export const useInvestmentMetrics = (
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
    
    // Initial investment includes deposit and purchase costs
    const initialInvestment = propertyDetails.depositAmount + 
                            costStructure.purchaseCosts.total;

    const updatedProjections = yearlyProjections.map(projection => {
      // Calculate management fees based on rental income
      const managementFees = propertyDetails.managementFee.type === 'percentage'
        ? (projection.rentalIncome * propertyDetails.managementFee.value / 100)
        : propertyDetails.managementFee.value;

      // Calculate total depreciation
      const capitalWorksDepreciation = propertyDetails.capitalWorksDepreciation;
      const plantEquipmentDepreciation = propertyDetails.plantEquipmentDepreciation;
      const totalDepreciation = capitalWorksDepreciation + plantEquipmentDepreciation;

      // Calculate yearly expenses
      const yearlyExpenses = 
        projection.yearlyInterestPaid +    // Interest cost
        managementFees +                   // Property management
        costStructure.annualPropertyCosts; // Other property costs (maintenance, insurance, etc.)

      // Calculate taxable income (rental income minus deductible expenses and depreciation)
      const taxableIncome = projection.rentalIncome - 
                           yearlyExpenses - 
                           totalDepreciation;

      // Calculate tax benefit if negatively geared
      const taxBenefit = calculateTaxBenefit(
        propertyDetails.taxableIncome,
        taxableIncome
      );

      // Calculate cash flow (includes tax benefits)
      const cashFlow = projection.rentalIncome - 
                      yearlyExpenses -
                      projection.yearlyPrincipalPaid + // Principal payments aren't tax deductible
                      taxBenefit;

      // Calculate equity position
      const equity = projection.propertyValue - projection.loanBalance;

      // Calculate ROI for this year
      // (Cash Flow + Equity Gain) / Initial Investment
      const equityGain = projection.propertyValue - 
                        (projection.year === 1 ? propertyDetails.purchasePrice : yearlyProjections[projection.year - 2].propertyValue);
      const roi = ((cashFlow + equityGain) / initialInvestment) * 100;

      console.log(`Investment Metrics Calculation:
        Year: ${projection.year}
        Rental Income: ${projection.rentalIncome}
        Management Fees: ${managementFees}
        Property Costs: ${costStructure.annualPropertyCosts}
        Interest Paid: ${projection.yearlyInterestPaid}
        Principal Paid: ${projection.yearlyPrincipalPaid}
        Total Depreciation: ${totalDepreciation}
        Taxable Income: ${taxableIncome}
        Tax Benefit: ${taxBenefit}
        Cash Flow: ${cashFlow}
        Equity: ${equity}
        ROI: ${roi}%
      `);

      return {
        ...projection,
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
      };
    });

    const lastProjection = updatedProjections[updatedProjections.length - 1];

    return {
      yearlyProjections: updatedProjections,
      netPositionAtEnd: lastProjection.equity + lastProjection.cashFlow,
      totalDepreciation: lastProjection.totalDepreciation * updatedProjections.length,
      averageROI: updatedProjections.reduce((acc, curr) => acc + curr.roi, 0) / updatedProjections.length
    };
  }, [propertyDetails, marketData, costStructure, baseProjections]);
};
