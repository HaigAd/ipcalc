import { DepreciationSchedule } from '../utils/depreciation';

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT';

// Base property details
interface BasePropertyDetails {
  purchasePrice: number;
  depositAmount: number;
  investmentRent: number;  // Weekly rental income from investment property
  managementFee: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}

// Loan related details
export interface LoanDetails {
  interestRate: number;
  loanTerm: number;
  interestRateChanges?: {
    year: number;
    rate: number;
  }[];
  loanType: 'principal-and-interest' | 'interest-only';
  waiveLMI: boolean;
  lmiCalculationMode: 'auto' | 'manual';
  manualLMIAmount: number;
  offsetContribution: {
    amount: number;
    frequency: 'weekly' | 'monthly' | 'yearly';
  };
  manualOffsetAmount?: number;
}

// Tax related details
interface TaxDetails {
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
  homeBuyerType: 'first-home-buyer' | 'non-first-home-buyer';  // Used for state/Federal buyer assistance gating
  propertyPurchaseType: 'new' | 'established';  // Used to determine grant and concession pathways
  grantApplicantAge18OrOver: boolean;  // Grant eligibility precision control
  grantApplicantCitizenOrPR: boolean;  // Grant eligibility precision control
  grantWillOccupyProperty: boolean;  // Grant eligibility precision control
  useCustomCGTDiscount: boolean;  // Use a custom CGT discount rate instead of the standard rule
  cgtDiscountRate: number;  // CGT discount rate as a decimal (0.5 = 50%)
  noNegativeGearing: boolean;  // Disallow offsetting property losses against personal income
  noNegativeGearingStartYear: number;  // Year to start quarantining losses
  depreciationSchedule: DepreciationSchedule;  // Depreciation configuration
}

// Combined property details (main interface used throughout the app)
export interface PropertyDetails extends BasePropertyDetails, LoanDetails, TaxDetails {}

export interface PurchaseCosts {
  conveyancingFee: number;
  buildingAndPestFee: number;
  transferFee: number;
  lmi: number;
  stampDutyBeforeConcessions: number;
  stampDutyConcession: number;
  stampDuty: number;
  homeBuyerGrant: number;
  homeBuyerGrantProgram: string | null;
  homeBuyerGrantBlockedByPrecisionInputs: boolean;
  netPurchaseCostBenefits: number;
  total: number;
  mortgageRegistrationFee: number;
  state: AustralianState;
}

export interface CostStructure {
  purchaseCosts: PurchaseCosts;
  waterCost: number;
  ratesCost: number;
  maintenancePercentage: number;
  maintenanceCost: number;
  insuranceCost: number;
  annualPropertyCosts: number;
  futureSellCosts: number;
  futureSellCostsPercentage: number;
  costBase: number;  // Total cost base for CGT calculations (purchase + costs - depreciation)
}
