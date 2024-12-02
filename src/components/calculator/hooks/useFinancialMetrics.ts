import { useMemo } from 'react';
import { 
  PropertyDetails, 
  MarketData, 
  CostStructure,
  YearlyProjection,
  FinancialMetrics 
} from '../types';

export const useFinancialMetrics = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure,
  yearlyProjections: YearlyProjection[]
): FinancialMetrics => {
  return useMemo(() => {
    // Total initial investment
    const totalInvestment = propertyDetails.depositAmount + costStructure.purchaseCosts.total;

    // First year metrics
    const firstYearProjection = yearlyProjections[0];
    const annualRent = propertyDetails.weeklyRent * 52;
    const annualCosts = costStructure.annualPropertyCosts + (firstYearProjection?.totalCosts ?? 0);

    // Return on Investment (ROI)
    const netPositionAtEnd = yearlyProjections[yearlyProjections.length - 1]?.netPosition ?? 0;
    const returnOnInvestment = (netPositionAtEnd / totalInvestment) * 100;

    // Cash on Cash Return
    const annualCashFlow = annualRent - annualCosts;
    const cashOnCash = (annualCashFlow / totalInvestment) * 100;

    // Capital Growth Rate (using property growth rate from market data)
    const capitalGrowth = marketData.propertyGrowthRate;

    // Net Yield
    const netYield = (annualCashFlow / propertyDetails.purchasePrice) * 100;

    return {
      returnOnInvestment,
      cashOnCash,
      capitalGrowth,
      netYield
    };
  }, [propertyDetails, marketData, costStructure, yearlyProjections]);
};
