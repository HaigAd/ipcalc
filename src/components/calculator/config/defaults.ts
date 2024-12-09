import { PropertyDetails, MarketData, CostStructure } from '../types';

export const defaultPropertyDetails: PropertyDetails = {
  purchasePrice: 1180000,
  depositAmount: 118000, // 10% default
  availableSavings: 300000,
  interestRate: 6.17,
  loanTerm: 30,
  isPPOR: false,
  isFirstHomeBuyer: false,
  considerPPORTax: false,
  weeklyRent: 750, // Moved from MarketData
  otherPropertyValue: 1200000, // Moved from MarketData
  otherPropertyCostBase: 1258000, // Cost base of the other property for CGT calculations
  offsetContribution: {
    amount: 0,
    frequency: 'monthly'
  }
};

export const defaultMarketData: MarketData = {
  propertyGrowthRate: 3,
  rentIncreaseRate: 3,
  opportunityCostRate: 3
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
  futureSellCostsPercentage: 2.5
};
