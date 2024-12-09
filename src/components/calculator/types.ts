export interface PropertyDetails {
  purchasePrice: number;
  depositAmount: number;
  availableSavings: number;
  interestRate: number;
  loanTerm: number;
  isPPOR: boolean;
  isFirstHomeBuyer: boolean;
  considerPPORTax: boolean;  // New field: flag to consider tax implications of PPOR change
  weeklyRent: number;  // Moved from MarketData
  otherPropertyValue: number;  // Value of the other property for CGT calculations - moved from MarketData
  otherPropertyCostBase: number;  // Cost base of the other property for CGT calculations
  offsetContribution: {
    amount: number;
    frequency: 'weekly' | 'monthly' | 'yearly';
  };
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
  annualPropertyCosts: number; // Computed total of water, rates, maintenance, and insurance
  futureSellCosts: number;
  futureSellCostsPercentage: number;
}

export interface YearlyProjection {
  year: number;
  propertyValue: number;
  loanBalance: number;
  totalCosts: number;
  rentalCosts: number;
  netPosition: number;
  cumulativeBuyingCosts: number;
  cumulativeRentalCosts: number;
  yearlyOpportunityCost: number;
  cumulativeOpportunityCost: number;  // Total opportunity cost accumulated to date
  offsetBalance: number;
  interestSaved: number;
  cumulativeInterestSaved: number;
  effectiveLoanBalance: number;
  originalLoanBalance: number;
  existingPPORValue: number;  // Value of existing PPOR for this year
  yearlyCGT: number;  // CGT payable for this year
  yearlyPrincipalPaid: number;  // Principal paid this year
  cumulativePrincipalPaid: number;  // Total principal paid to date
  yearlyPrincipalSavingsOpportunityCost: number;  // Opportunity cost on equivalent principal savings
  cumulativePrincipalSavingsOpportunityCost: number;  // Total opportunity cost on principal savings
  yearlyRentVsBuyCashFlow: number;  // Annual cash flow difference between renting vs buying
  cumulativeInvestmentReserves: number;  // Cumulative amount available for investment if renting
  yearlyInterestPaid: number;  // Interest paid this year (calculated with monthly compounding)
  yearlyOffsetContributions: number;  // Total offset contributions made this year
  cumulativeOffsetContributions: number;  // Total offset contributions made to date
}

export interface CalculationResults {
  yearlyProjections: YearlyProjection[];
  breakEvenYear: number;
  totalCostDifference: number;
  netPositionAtEnd: number;
  offsetAmount: number;
  totalInterestSaved: number;
  yearsReducedFromLoan: number;
  monthsReducedFromLoan: number;  // Additional months beyond full years
  monthlyMortgagePayment: number;
  principal: number;  // Initial loan amount (purchase price minus deposit)
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
