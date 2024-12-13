import { PropertyDetails } from '../types';

export const calculateMonthlyPayment = (
  principal: number, 
  annualRate: number, 
  years: number,
  loanType: 'principal-and-interest' | 'interest-only'
) => {
  const monthlyRate = (annualRate / 100) / 12;

  if (loanType === 'interest-only') {
    // For IO loans, monthly payment is just the interest
    return principal * monthlyRate;
  } else {
    // For P&I loans, calculate amortized payment including principal
    const totalMonths = years * 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
           (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }
};

// Calculate monthly interest-only portion of payment
export const calculateMonthlyInterest = (principal: number, annualRate: number) => {
  const monthlyRate = (annualRate / 100) / 12;
  return principal * monthlyRate;
};

export const getMonthlyContribution = (offsetContribution: PropertyDetails['offsetContribution']) => {
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

// Helper function to calculate management fees
export const calculateManagementFees = (
  annualRent: number,
  feeType: 'percentage' | 'fixed',
  feeValue: number
) => {
  return feeType === 'percentage'
    ? (annualRent * feeValue / 100)
    : feeValue;
};

// Helper function to calculate total depreciation
export const calculateTotalDepreciation = (
  capitalWorksDepreciation: number,
  plantEquipmentDepreciation: number
) => {
  return capitalWorksDepreciation + plantEquipmentDepreciation;
};
