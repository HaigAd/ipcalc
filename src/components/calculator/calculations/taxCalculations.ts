interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
}

// Australian tax brackets for 2023-2024
export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 18200, rate: 0, base: 0 },
  { min: 18201, max: 45000, rate: 0.16, base: 0 },
  { min: 45001, max: 135000, rate: 0.30, base: 4288 },
  { min: 135001, max: 190000, rate: 0.37, base: 31288 },
  { min: 190001, max: Infinity, rate: 0.45, base: 51638 }
];

const MEDICARE_LEVY_RATE = 0.02;

export const getTaxBracket = (income: number): TaxBracket => {
  const bracket = TAX_BRACKETS.find(b => income >= b.min && income <= b.max);
  return bracket ? bracket : TAX_BRACKETS[0];
};

export const calculateMedicareLevy = (income: number): number => {
  return income * MEDICARE_LEVY_RATE;
};

export const calculateTaxPayable = (income: number): number => {
  const bracket = getTaxBracket(income);
  if (!bracket) return 0;
  const incomeTax = (income - bracket.min) * bracket.rate + bracket.base;
  const medicareLevy = calculateMedicareLevy(income);
  return incomeTax + medicareLevy;
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
