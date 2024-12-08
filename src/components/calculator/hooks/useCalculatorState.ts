import { useState, useEffect } from 'react';
import { PropertyDetails, MarketData, CostStructure, AustralianState } from '../types';
import { defaultPropertyDetails, defaultMarketData, defaultCostStructure } from '../config/defaults';
import { usePropertyCalculator } from './usePropertyCalculator';
import { useFinancialMetrics } from './useFinancialMetrics';
import { usePurchaseCosts } from './usePurchaseCosts';
import { useFormPersistence, getStoredState } from './useFormPersistence';

export function useCalculatorState() {
  const storedState = getStoredState();
  
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>(
    storedState?.propertyDetails || defaultPropertyDetails
  );
  const [marketData, setMarketData] = useState<MarketData>(
    storedState?.marketData || defaultMarketData
  );
  const [costStructure, setCostStructure] = useState<CostStructure>(
    storedState?.costStructure || defaultCostStructure
  );
  const [conveyancingFee, setConveyancingFee] = useState(
    storedState?.costStructure.purchaseCosts.conveyancingFee || defaultCostStructure.purchaseCosts.conveyancingFee
  );
  const [buildingAndPestFee, setBuildingAndPestFee] = useState(
    storedState?.costStructure.purchaseCosts.buildingAndPestFee || defaultCostStructure.purchaseCosts.buildingAndPestFee
  );
  const [state, setState] = useState<AustralianState>(
    storedState?.costStructure.purchaseCosts.state || defaultCostStructure.purchaseCosts.state
  );

  const purchaseCosts = usePurchaseCosts(propertyDetails, conveyancingFee, buildingAndPestFee, state);
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

  const { resetToDefaults } = useFormPersistence({
    propertyDetails,
    setPropertyDetails,
    marketData,
    setMarketData,
    costStructure,
    updateCostStructure,
  });

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
    calculationResults,
    resetToDefaults,
    state,
    setState
  };
}
