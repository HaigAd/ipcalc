import { DepreciationSchedule } from '../utils/depreciation';

export interface TaxDetails {
  taxableIncome: number;  // User's taxable income for negative gearing calculations
  isCGTExempt: boolean;  // 6-year CGT exemption rule flag
  depreciationSchedule: DepreciationSchedule;  // Depreciation configuration
}

export interface TaxProjection {
  totalDepreciation: number;
  taxableIncome: number;  // Rental income minus deductible expenses
  taxBenefit: number;     // Tax savings from negative gearing if applicable
  cashFlow: number;       // Net cash position after all income, expenses and tax benefits
  cgtPayable: number;    // CGT payable if property was sold this year
  netEquityAfterCGT: number; // Equity minus CGT payable
}

export interface TaxResults {
  totalDepreciation: number;    // Total depreciation benefits over loan term
  finalCGTPayable: number;     // CGT payable at end of projection period
}
