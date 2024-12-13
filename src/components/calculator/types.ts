export interface PropertyDetails {
  purchasePrice: number;
  depositAmount: number;
  availableSavings: number;
  interestRate: number;
  loanTerm: number;
  loanType: 'principal-and-interest' | 'interest-only';  // Added loan type
  investmentRent: number;  // Weekly rental income from investment property
  offsetContribution: {
    amount: number;
    frequency: 'weekly' | 'monthly' | 'yearly';
  };
  manualOffsetAmount?: number;  // Optional manual override for offset amount
  managementFee: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  capitalWorksDepreciation: number;  // Annual amount for building depreciation
  plantEquipmentDepreciation: number;  // Annual amount for plant and equipment
  taxableIncome: number;  // User's taxable income for negative gearing calculations
  isCGTExempt: boolean;  // 6-year CGT exemption rule flag
}

export interface MarketData {
  propertyGrowthRate: number;
  rentIncreaseRate: number;
  opportunityCostRate: number;
  operatingExpensesGrowthRate: number;  // Annual growth rate for operating expenses (0-10%)
}

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT';

export interface PurchaseCosts {
  conveyancingFee: number;
  buildingAndPestFee: number;
  transferFee: number;
  stampDuty: number;
  total: number;
  mortgageRegistrationFee: number;
  state: AustralianState;
}

export interface CostStructure {
  purchaseCosts: PurchaseCosts;
  waterCost: number;
  ratesCost: number;
  maintenancePercentage: number;
  maintenanceCost: number;
  insuranceCost: number;
  annualPropertyCosts: number;
  futureSellCosts: number;
  futureSellCostsPercentage: number;
  costBase: number;  // Total cost base for CGT calculations (purchase + costs - depreciation)
}

export interface YearlyProjection {
  year: number;
  propertyValue: number;
  loanBalance: number;
  rentalIncome: number;
  offsetBalance: number;
  interestSaved: number;
  cumulativeInterestSaved: number;
  effectiveLoanBalance: number;
  originalLoanBalance: number;
  yearlyPrincipalPaid: number;
  cumulativePrincipalPaid: number;
  yearlyInterestPaid: number;
  yearlyOffsetContributions: number;
  cumulativeOffsetContributions: number;
  managementFees: number;
  capitalWorksDepreciation: number;
  plantEquipmentDepreciation: number;
  totalDepreciation: number;
  yearlyExpenses: number;  // All expenses including interest, management fees, maintenance etc.
  taxableIncome: number;  // Rental income minus deductible expenses
  taxBenefit: number;     // Tax savings from negative gearing if applicable
  cashFlow: number;       // Net cash position after all income, expenses and tax benefits
  equity: number;         // Property value minus loan balance
  roi: number;           // Return on investment percentage
  capitalGain: number;   // Capital gain for the year (increase in property value)
  cgtPayable: number;    // CGT payable if property was sold this year
  netEquityAfterCGT: number; // Equity minus CGT payable
}

export interface CalculationResults {
  yearlyProjections: YearlyProjection[];
  offsetAmount: number;
  totalInterestSaved: number;
  yearsReducedFromLoan: number;
  monthsReducedFromLoan: number;
  monthlyMortgagePayment: number;
  principal: number;
  netPositionAtEnd: number;     // Total equity plus final year cash flow
  totalDepreciation: number;    // Total depreciation benefits over loan term
  averageROI: number;          // Average return on investment over loan term
  finalCGTPayable: number;     // CGT payable at end of projection period
}

export interface MortgageCalculation {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  yearlySchedule: {
    year: number;
    remainingBalance: number;
    interestPaid: number;
    principalPaid: number;
  }[];
}

export interface FinancialMetrics {
  returnOnInvestment: number;
  cashOnCash: number;
  capitalGrowth: number;
  netYield: number;
}
