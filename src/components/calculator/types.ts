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
}

export interface MarketData {
  propertyGrowthRate: number;
  rentIncreaseRate: number;
  opportunityCostRate: number;
  otherPropertyValue: number;  // Value of the other property for CGT calculations
}

export interface PurchaseCosts {
  conveyancingFee: number;
  buildingAndPestFee: number;
  transferFee: number;
  stampDuty: number;
  total: number;
  mortgageRegistrationFee: number;
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
  offsetBalance: number;
  interestSaved: number;
  cumulativeInterestSaved: number;
  effectiveLoanBalance: number;
  originalLoanBalance: number;
  existingPPORValue: number;  // New field: value of existing PPOR for this year
  yearlyCGT: number;  // New field: CGT payable for this year
  yearlyPrincipalPaid: number;  // Principal paid this year
  cumulativePrincipalPaid: number;  // Total principal paid to date
  yearlyPrincipalSavingsOpportunityCost: number;  // Opportunity cost on equivalent principal savings
  cumulativePrincipalSavingsOpportunityCost: number;  // Total opportunity cost on principal savings
}

export interface CalculationResults {
  yearlyProjections: YearlyProjection[];
  breakEvenYear: number;
  totalCostDifference: number;
  netPositionAtEnd: number;
  offsetAmount: number;
  totalInterestSaved: number;
  yearsReducedFromLoan: number;
  monthlyMortgagePayment: number;
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
