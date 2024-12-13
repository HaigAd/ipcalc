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
  yearlyExpenses: number;  // All expenses including interest, management fees, maintenance etc.
  equity: number;         // Property value minus loan balance
  roi: number;           // Return on investment percentage
  capitalGain: number;   // Capital gain for the year (increase in property value)
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
