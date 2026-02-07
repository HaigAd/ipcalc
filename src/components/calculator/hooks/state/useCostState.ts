import { useState, useEffect } from 'react';
import { CostStructure, PropertyDetails, YearlyProjection } from '../../types';
import { defaultCostStructure } from '../../config/defaults';
import { getStoredState } from '../useFormPersistence';

export function useCostState(propertyDetails: PropertyDetails, yearlyProjections: YearlyProjection[] = []) {
  const storedState = getStoredState();
  
  const [costStructure, setCostStructure] = useState<CostStructure>(
    storedState?.costStructure || defaultCostStructure
  );
  
  const [conveyancingFee, setConveyancingFee] = useState(
    storedState?.costStructure.purchaseCosts.conveyancingFee || defaultCostStructure.purchaseCosts.conveyancingFee
  );
  
  const [buildingAndPestFee, setBuildingAndPestFee] = useState(
    storedState?.costStructure.purchaseCosts.buildingAndPestFee || defaultCostStructure.purchaseCosts.buildingAndPestFee
  );

  // Update maintenance cost and annual property costs when relevant values change
  useEffect(() => {
    const maintenanceCost = (propertyDetails.purchasePrice * costStructure.maintenancePercentage) / 100;
    const newAnnualPropertyCosts = costStructure.waterCost + costStructure.ratesCost + maintenanceCost + costStructure.insuranceCost;
    
    setCostStructure(prev => ({
      ...prev,
      maintenanceCost,
      annualPropertyCosts: newAnnualPropertyCosts
    }));
  }, [
    propertyDetails.purchasePrice,
    costStructure.maintenancePercentage,
    costStructure.waterCost,
    costStructure.ratesCost,
    costStructure.insuranceCost
  ]);

  // Update future sell costs when projections change
  useEffect(() => {
    if (yearlyProjections.length > 0) {
      const finalPropertyValue = yearlyProjections[yearlyProjections.length - 1].propertyValue;
      const newFutureSellCosts = (finalPropertyValue * costStructure.futureSellCostsPercentage) / 100;
      
      if (newFutureSellCosts !== costStructure.futureSellCosts) {
        setCostStructure(prev => ({
          ...prev,
          futureSellCosts: newFutureSellCosts
        }));
      }
    }
  }, [yearlyProjections, costStructure.futureSellCostsPercentage, costStructure.futureSellCosts]);

  const updateCostStructure = (costs: Partial<CostStructure>) => {
    const newCostStructure = {
      ...costStructure,
      ...costs,
    };

    if (costs.futureSellCostsPercentage !== undefined && yearlyProjections.length > 0) {
      const finalPropertyValue = yearlyProjections[yearlyProjections.length - 1].propertyValue;
      newCostStructure.futureSellCosts = (finalPropertyValue * costs.futureSellCostsPercentage) / 100;
    }

    setCostStructure(newCostStructure);
  };

  return {
    costStructure,
    updateCostStructure,
    conveyancingFee,
    setConveyancingFee,
    buildingAndPestFee,
    setBuildingAndPestFee,
  };
}
