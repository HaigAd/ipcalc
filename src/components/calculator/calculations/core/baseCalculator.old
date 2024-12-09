import { PropertyDetails, MarketData, CostStructure } from '../../types';

export interface BaseCalculationParams {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  costStructure: CostStructure;
}

export interface YearlyProjection {
  year: number;
  propertyValue: number;
  loanBalance: number;
  totalCosts: number;
  rentalCosts: number;
  netPosition: number;
  cumulativeBuyingCosts: number;
  cumulativeRentalCosts: number;
  yearlyOpportunityCost: number;
  cumulativeOpportunityCost: number;
  offsetBalance: number;
  interestSaved: number;
  cumulativeInterestSaved: number;
  effectiveLoanBalance: number;
  originalLoanBalance: number;
  existingPPORValue: number;
  yearlyCGT: number;
  yearlyPrincipalPaid: number;
  cumulativePrincipalPaid: number;
  yearlyPrincipalSavingsOpportunityCost: number;
  cumulativePrincipalSavingsOpportunityCost: number;
  yearlyRentVsBuyCashFlow: number;
  cumulativeInvestmentReserves: number;
  rentalIncome: number;
  expenses: number;
  netCashFlow: number;
}

export class BaseCalculator {
  protected propertyDetails: PropertyDetails;
  protected marketData: MarketData;
  protected costStructure: CostStructure;

  constructor(params: BaseCalculationParams) {
    this.propertyDetails = params.propertyDetails;
    this.marketData = params.marketData;
    this.costStructure = params.costStructure;
  }

  protected calculatePropertyValue(initialValue: number, growthRate: number, years: number): number {
    return initialValue * Math.pow(1 + growthRate / 100, years);
  }

  protected calculateRentalIncome(propertyValue: number, rentIncreaseRate: number): number {
    const weeklyRent = this.propertyDetails.weeklyRent;
    const annualRent = weeklyRent * 52;
    return annualRent * Math.pow(1 + rentIncreaseRate / 100, 1);
  }

  protected calculateAnnualExpenses(propertyValue: number): number {
    const maintenanceCost = (propertyValue * this.costStructure.maintenancePercentage) / 100;
    return maintenanceCost + this.costStructure.waterCost + this.costStructure.ratesCost + this.costStructure.insuranceCost;
  }

  protected calculateNetCashFlow(rentalIncome: number, expenses: number): number {
    return rentalIncome - expenses;
  }

  protected generateBaseProjection(year: number): Partial<YearlyProjection> {
    const propertyValue = this.calculatePropertyValue(
      this.propertyDetails.purchasePrice,
      this.marketData.propertyGrowthRate,
      year
    );

    const rentalIncome = this.calculateRentalIncome(propertyValue, this.marketData.rentIncreaseRate);
    const expenses = this.calculateAnnualExpenses(propertyValue);
    const netCashFlow = this.calculateNetCashFlow(rentalIncome, expenses);

    return {
      year,
      propertyValue,
      rentalIncome,
      expenses,
      netCashFlow,
    };
  }
}
