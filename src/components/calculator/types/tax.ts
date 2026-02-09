import { DepreciationSchedule } from '../utils/depreciation';

export interface TaxDetails {
  taxableIncome: number;  // User's taxable income for negative gearing calculations
  isCGTExempt: boolean;  // 6-year CGT exemption rule flag
  isPPOR: boolean;  // Treat property as principal place of residence (CGT exempt)
  includeLandTax: boolean;  // Include annual land tax in operating expenses
  landTaxCalculationMode: 'auto' | 'manual';  // Auto estimate by state/land value or manual amount
  landValue: number;  // Land value basis for land tax estimation
  otherTaxableLandValue: number;  // Other taxable land holdings used to determine marginal/incremental land tax
  landValueGrowthMode: 'property-growth-rate' | 'custom-rate';  // How land value grows year-to-year for land tax modelling
  customLandValueGrowthRate: number;  // Custom annual land value growth rate (%)
  manualLandTaxAmount: number;  // Manual annual land tax override
  grantApplicantAge18OrOver: boolean;  // Grant eligibility precision control
  grantApplicantCitizenOrPR: boolean;  // Grant eligibility precision control
  grantWillOccupyProperty: boolean;  // Grant eligibility precision control
  useCustomCGTDiscount: boolean;  // Use a custom CGT discount rate instead of the standard rule
  cgtDiscountRate: number;  // CGT discount rate as a decimal (0.5 = 50%)
  noNegativeGearing: boolean;  // Disallow offsetting property losses against personal income
  noNegativeGearingStartYear: number;  // Year to start quarantining losses
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
