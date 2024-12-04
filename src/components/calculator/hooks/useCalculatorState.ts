import { useState, useEffect } from 'react';
import { PropertyDetails, MarketData, CostStructure, PurchaseCosts, CalculationResults } from '../types';
import { defaultPropertyDetails, defaultMarketData, defaultCostStructure } from '../config/defaults';
import { usePropertyCalculator } from './usePropertyCalculator';
import { useFinancialMetrics } from './useFinancialMetrics';
import { usePurchaseCosts } from './usePurchaseCosts';

export function useCalculatorState() {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>(defaultPropertyDetails);
  const [marketData, setMarketData] = useState<MarketData>(defaultMarketData);
  const [costStructure, setCostStructure] = useState<CostStructure>(defaultCostStructure);
  const [conveyancingFee, setConveyancingFee] = useState(defaultCostStructure.purchaseCosts.conveyancingFee);
  const [buildingAndPestFee, setBuildingAndPestFee] = useState(defaultCostStructure.purchaseCosts.buildingAndPestFee);

  const purchaseCosts = usePurchaseCosts(propertyDetails, conveyancingFee, buildingAndPestFee);
  const calculationResults = usePropertyCalculator(propertyDetails, marketData, costStructure);
  useFinancialMetrics(
    propertyDetails,
    marketData,
    costStructure,
    calculationResults.yearlyProjections
  );

  useEffect(() => {
    setCostStructure(prev => ({
      ...prev,
      purchaseCosts
    }));
  }, [purchaseCosts]);

  useEffect(() => {
    const maintenanceCost = (propertyDetails.purchasePrice * costStructure.maintenancePercentage) / 100;
    const newAnnualPropertyCosts = costStructure.waterCost + costStructure.ratesCost + maintenanceCost + costStructure.insuranceCost;
    
    setCostStructure(prev => ({
      ...prev,
      maintenanceCost,
      annualPropertyCosts: newAnnualPropertyCosts
    }));
  }, [propertyDetails.purchasePrice, costStructure.maintenancePercentage, costStructure.waterCost, costStructure.ratesCost, costStructure.insuranceCost]);

  useEffect(() => {
    if (calculationResults.yearlyProjections.length > 0) {
      const finalPropertyValue = calculationResults.yearlyProjections[calculationResults.yearlyProjections.length - 1].propertyValue;
      const newFutureSellCosts = (finalPropertyValue * costStructure.futureSellCostsPercentage) / 100;
      
      if (newFutureSellCosts !== costStructure.futureSellCosts) {
        setCostStructure(prev => ({
          ...prev,
          futureSellCosts: newFutureSellCosts
        }));
      }
    }
  }, [calculationResults.yearlyProjections, costStructure.futureSellCostsPercentage]);

  const updateCostStructure = (costs: Partial<CostStructure>) => {
    const newCostStructure = {
      ...costStructure,
      ...costs,
      purchaseCosts: purchaseCosts
    };

    if (costs.futureSellCostsPercentage !== undefined && calculationResults.yearlyProjections.length > 0) {
      const finalPropertyValue = calculationResults.yearlyProjections[calculationResults.yearlyProjections.length - 1].propertyValue;
      newCostStructure.futureSellCosts = (finalPropertyValue * costs.futureSellCostsPercentage) / 100;
    }

    setCostStructure(newCostStructure);
  };

  return {
    propertyDetails,
    setPropertyDetails,
    marketData,
    setMarketData,
    costStructure,
    updateCostStructure,
    conveyancingFee,
    setConveyancingFee,
    buildingAndPestFee,
    setBuildingAndPestFee,
    purchaseCosts,
    calculationResults
  };
}
