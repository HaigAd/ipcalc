export interface PropertyDetails {
  purchasePrice: number;
  depositAmount: number;
  availableSavings: number;
  interestRate: number;
  loanTerm: number;
  investmentRent: number;  // Weekly rental income from investment property
  offsetContribution: {
    amount: number;
    frequency: 'weekly' | 'monthly' | 'yearly';
  };
  managementFee: {
    type: 'percentage' | 'fixed';
    value: number;
  };
  capitalWorksDepreciation: number;  // Annual amount for building depreciation
  plantEquipmentDepreciation: number;  // Annual amount for plant and equipment
  taxableIncome: number;  // User's taxable income for negative gearing calculations
}

export interface MarketData {
  propertyGrowthRate: number;
  rentIncreaseRate: number;
  opportunityCostRate: number;
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
