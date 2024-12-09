import { BaseCalculator, BaseCalculationParams, YearlyProjection } from './baseCalculator';
import { MortgageCalculation } from '../../types';

export class PropertyProjections extends BaseCalculator {
  private mortgageCalculation: MortgageCalculation;
  private readonly originalLoanBalance: number;

  constructor(params: BaseCalculationParams, mortgageCalculation: MortgageCalculation) {
    super(params);
    this.mortgageCalculation = mortgageCalculation;
    this.originalLoanBalance = this.propertyDetails.purchasePrice - this.propertyDetails.depositAmount;
  }

  public generateProjections(years: number): YearlyProjection[] {
    const projections: YearlyProjection[] = [];

    for (let year = 0; year < years; year++) {
      const baseProjection = this.generateBaseProjection(year);
      const mortgageInfo = this.mortgageCalculation.yearlySchedule[year];

      const projection: YearlyProjection = {
        year,
        propertyValue: baseProjection.propertyValue!,
        rentalIncome: baseProjection.rentalIncome!,
        expenses: baseProjection.expenses!,
        netCashFlow: baseProjection.netCashFlow!,
        loanBalance: mortgageInfo.remainingBalance,
        totalCosts: 0, // Will be calculated in a separate method
        rentalCosts: 0, // Will be calculated in a separate method
        netPosition: 0, // Will be calculated in a separate method
        cumulativeBuyingCosts: 0, // Will be calculated in a separate method
        cumulativeRentalCosts: 0, // Will be calculated in a separate method
        yearlyOpportunityCost: 0, // Will be calculated in a separate method
        cumulativeOpportunityCost: 0, // Will be calculated in a separate method
        offsetBalance: 0, // Will be calculated in a separate method
        interestSaved: 0, // Will be calculated in a separate method
        cumulativeInterestSaved: 0, // Will be calculated in a separate method
        effectiveLoanBalance: mortgageInfo.remainingBalance, // May be updated by offset calculations
        originalLoanBalance: this.originalLoanBalance,
        existingPPORValue: 0, // Will be calculated if applicable
        yearlyCGT: 0, // Will be calculated if applicable
        yearlyPrincipalPaid: mortgageInfo.principalPaid,
        cumulativePrincipalPaid: this.calculateCumulativePrincipal(year),
        yearlyPrincipalSavingsOpportunityCost: this.calculatePrincipalOpportunityCost(mortgageInfo.principalPaid),
        cumulativePrincipalSavingsOpportunityCost: this.calculateCumulativePrincipalOpportunityCost(year),
        yearlyRentVsBuyCashFlow: this.calculateRentVsBuyCashFlow(baseProjection),
        cumulativeInvestmentReserves: 0 //handled elsewhere
      };

      projections.push(projection);
    }

    return projections;
  }

  private calculateCumulativePrincipal(currentYear: number): number {
    return this.mortgageCalculation.yearlySchedule
      .slice(0, currentYear + 1)
      .reduce((total, year) => total + year.principalPaid, 0);
  }

  private calculatePrincipalOpportunityCost(principalPaid: number): number {
    return (principalPaid * this.marketData.opportunityCostRate) / 100;
  }

  private calculateCumulativePrincipalOpportunityCost(currentYear: number): number {
    return this.mortgageCalculation.yearlySchedule
      .slice(0, currentYear + 1)
      .reduce((total, year) => total + this.calculatePrincipalOpportunityCost(year.principalPaid), 0);
  }

  private calculateRentVsBuyCashFlow(baseProjection: Partial<YearlyProjection>): number {
    const monthlyMortgage = this.mortgageCalculation.monthlyPayment;
    const annualMortgage = monthlyMortgage * 12;
    const annualRent = this.propertyDetails.weeklyRent * 52;
    
    return annualRent - (annualMortgage + baseProjection.expenses!);
  }


  private calculateCumulativeInvestmentReserves(currentYear: number, projections: YearlyProjection[]): number {
    let previousReserves = 0;
    if (currentYear === 1) {
      // Start with deposit + purchase costs + available savings (offset) as the initial investment
      previousReserves = this.propertyDetails.depositAmount + this.costStructure.purchaseCosts.total + this.propertyDetails.availableSavings;
            
    } else {
      previousReserves = projections[currentYear - 1].cumulativeInvestmentReserves;
    }

    
    const currentCashFlow = projections[currentYear - 1].yearlyRentVsBuyCashFlow;
    const investmentReturn = (previousReserves * this.marketData.opportunityCostRate) / 100;

    return previousReserves + currentCashFlow + investmentReturn;
  }
}
