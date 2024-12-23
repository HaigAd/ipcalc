export interface MarketData {
  propertyGrowthRate: number;
  rentIncreaseRate: number;
  opportunityCostRate: number;
  operatingExpensesGrowthRate: number;  // Annual growth rate for operating expenses (0-10%)
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
  taxableIncome: number;
  taxBenefit: number;
  cashFlow: number;
  equity: number;         // Property value minus loan balance
  roi: number;           // Return on investment percentage
  irr?: number;          // Internal rate of return (optional)
  capitalGain: number;   // Capital gain for the year (increase in property value)
  cgtPayable: number;
  netEquityAfterCGT: number;
  cumulativeOperatingPosition: number; //Cumulative tracker of annual costs + annual income
  netPosition: number; //After appreciation, CGT and application of cumulative Operating Position
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
  averageROI: number;          // Average return on investment over loan term
}
