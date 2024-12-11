interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
}

// Australian tax brackets for 2023-2024
export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.19, base: 0 },
  { min: 45001, max: 120000, rate: 0.325, base: 5092 },
  { min: 120001, max: 180000, rate: 0.37, base: 29467 },
  { min: 180001, max: Infinity, rate: 0.45, base: 51667 }
];

export const getTaxBracket = (income: number): TaxBracket | undefined => {
  return TAX_BRACKETS.find(b => income >= b.min && income <= b.max);
};

export const calculateTaxPayable = (income: number): number => {
  const bracket = getTaxBracket(income);
  if (!bracket) return 0;
  return (income - bracket.min) * bracket.rate + bracket.base;
};

export const calculateTaxBenefit = (totalTaxableIncome: number, propertyIncome: number): number => {
  // Calculate tax on total income
  const taxOnTotalIncome = calculateTaxPayable(totalTaxableIncome);
  
  // Calculate tax on income after property deductions
  const reducedIncome = totalTaxableIncome + propertyIncome; // propertyIncome is negative for losses
  const taxOnReducedIncome = calculateTaxPayable(reducedIncome);
  
  // Tax benefit is the difference
  return Math.max(0, taxOnTotalIncome - taxOnReducedIncome);
};
