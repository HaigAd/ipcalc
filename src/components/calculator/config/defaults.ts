import { PropertyDetails, MarketData, CostStructure } from '../types';
import { DepreciationSchedule } from '../utils/depreciation';

export const defaultDepreciationSchedule: DepreciationSchedule = {
  mode: 'fixed',
  fixedCapitalWorks: 0,
  fixedPlantEquipment: 0,
};

export const defaultPropertyDetails: PropertyDetails = {
  purchasePrice: 750000,
  depositAmount: 75000, // 10% default
  interestRate: 6.0,
  loanTerm: 30,
  loanType: 'principal-and-interest', // Default to P&I loans
  waiveLMI: false,
  lmiCalculationMode: 'auto',
  manualLMIAmount: 0,
  investmentRent: 750, // Weekly rental income
  offsetContribution: {
    amount: 0,
    frequency: 'monthly'
  },
  manualOffsetAmount: 0,
  interestRateChanges: [], // Initialize empty array for interest rate changes
  managementFee: {
    type: 'percentage',
    value: 7.5
  },
  depreciationSchedule: defaultDepreciationSchedule,
  taxableIncome: 120000,
  isCGTExempt: false,  // Default to not using 6-year rule
  isPPOR: false,
  includeLandTax: false,
  landTaxCalculationMode: 'auto',
  landValue: 450000,
  otherTaxableLandValue: 0,
  landValueGrowthMode: 'property-growth-rate',
  customLandValueGrowthRate: 3,
  manualLandTaxAmount: 0,
  homeBuyerType: 'first-home-buyer',
  propertyPurchaseType: 'established',
  grantApplicantAge18OrOver: true,
  grantApplicantCitizenOrPR: true,
  grantWillOccupyProperty: true,
  useCustomCGTDiscount: false,
  cgtDiscountRate: 0.5,
  noNegativeGearing: false,
  noNegativeGearingStartYear: 1
};

export const defaultMarketData: MarketData = {
  propertyGrowthRate: 3,
  rentIncreaseRate: 3,
  operatingExpensesGrowthRate: 2.5,  // Default 2.5% annual growth in operating expenses
  currentValueYear: undefined,
  currentPropertyValue: undefined,
  propertyValueCorrections: undefined
};

export const defaultCostStructure: CostStructure = {
  purchaseCosts: {
    conveyancingFee: 2000,
    buildingAndPestFee: 500,
    transferFee: 0,
    lmi: 0,
    stampDutyBeforeConcessions: 0,
    stampDutyConcession: 0,
    stampDuty: 0,
    homeBuyerGrant: 0,
    homeBuyerGrantProgram: null,
    homeBuyerGrantBlockedByPrecisionInputs: false,
    netPurchaseCostBenefits: 0,
    mortgageRegistrationFee: 224,
    total: 2500,
    state: 'NSW'
  },
  waterCost: 800,
  ratesCost: 3000,
  maintenancePercentage: 1,
  maintenanceCost: 7500, // 1% of default purchase price
  insuranceCost: 2500,
  annualPropertyCosts: 13800, // Sum of water, rates, maintenance, and insurance
  futureSellCosts: 18750,
  futureSellCostsPercentage: 2.5,
  costBase: 752500  // Purchase price + purchase costs by default
};
