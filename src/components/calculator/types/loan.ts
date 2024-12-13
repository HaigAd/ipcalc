export interface LoanDetails {
  interestRate: number;
  loanTerm: number;
  loanType: 'principal-and-interest' | 'interest-only';
  offsetContribution: {
    amount: number;
    frequency: 'weekly' | 'monthly' | 'yearly';
  };
  manualOffsetAmount?: number;  // Optional manual override for offset amount
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

export interface OffsetResults {
  offsetAmount: number;
  totalInterestSaved: number;
  yearsReducedFromLoan: number;
  monthsReducedFromLoan: number;
  monthlyMortgagePayment: number;
  principal: number;
}
