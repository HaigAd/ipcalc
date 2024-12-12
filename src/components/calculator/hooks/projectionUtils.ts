import { PropertyDetails } from '../types';

export const calculateMonthlyPayment = (principal: number, annualRate: number, years: number) => {
  const monthlyRate = (annualRate / 100) / 12;
  const totalMonths = years * 12;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
         (Math.pow(1 + monthlyRate, totalMonths) - 1);
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
