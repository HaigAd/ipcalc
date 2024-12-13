import { PropertyDetails, MarketData, CostStructure } from '../types';

export const defaultPropertyDetails: PropertyDetails = {
  purchasePrice: 1180000,
  depositAmount: 118000, // 10% default
  availableSavings: 300000,
  interestRate: 6.17,
  loanTerm: 30,
  loanType: 'principal-and-interest', // Default to P&I loans
  investmentRent: 750, // Weekly rental income
  offsetContribution: {
    amount: 0,
    frequency: 'monthly'
  },
  manualOffsetAmount: undefined, // Default to automatic calculation
  managementFee: {
    type: 'percentage',
    value: 7.5
  },
  capitalWorksDepreciation: 0,
  plantEquipmentDepreciation: 0,
  taxableIncome: 120000,
  isCGTExempt: false  // Default to not using 6-year rule
};

export const defaultMarketData: MarketData = {
  propertyGrowthRate: 3,
  rentIncreaseRate: 3,
  opportunityCostRate: 3,
  operatingExpensesGrowthRate: 2.5  // Default 2.5% annual growth in operating expenses
};

export const defaultCostStructure: CostStructure = {
  purchaseCosts: {
    conveyancingFee: 2000,
    buildingAndPestFee: 500,
    transferFee: 0,
    stampDuty: 0,
    mortgageRegistrationFee: 224,
    total: 2500,
    state: 'NSW'
  },
  waterCost: 800,
  ratesCost: 3000,
  maintenancePercentage: 1,
  maintenanceCost: 11800, // 1% of default purchase price
  insuranceCost: 2500,
  annualPropertyCosts: 18100, // Sum of water, rates, maintenance, and insurance
  futureSellCosts: 29500,
  futureSellCostsPercentage: 2.5,
  costBase: 1182500  // Purchase price + purchase costs by default
};
