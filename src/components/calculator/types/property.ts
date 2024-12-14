import { DepreciationSchedule } from '../utils/depreciation';

export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'SA' | 'WA' | 'TAS' | 'NT' | 'ACT';

// Base property details
interface BasePropertyDetails {
  purchasePrice: number;
  depositAmount: number;
  availableSavings: number;
  investmentRent: number;  // Weekly rental income from investment property
  managementFee: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}

// Loan related details
interface LoanDetails {
  interestRate: number;
  loanTerm: number;
  loanType: 'principal-and-interest' | 'interest-only';
  offsetContribution: {
    amount: number;
    frequency: 'weekly' | 'monthly' | 'yearly';
  };
  manualOffsetAmount?: number;  // Optional manual override for offset amount
}

// Tax related details
interface TaxDetails {
  taxableIncome: number;  // User's taxable income for negative gearing calculations
  isCGTExempt: boolean;  // 6-year CGT exemption rule flag
  depreciationSchedule: DepreciationSchedule;  // Depreciation configuration
}

// Combined property details (main interface used throughout the app)
export interface PropertyDetails extends BasePropertyDetails, LoanDetails, TaxDetails {}

export interface PurchaseCosts {
  conveyancingFee: number;
  buildingAndPestFee: number;
  transferFee: number;
  stampDuty: number;
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
