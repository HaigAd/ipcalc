import { useEffect } from 'react';
import { PropertyDetails, MarketData, CostStructure } from '../types';
import { defaultPropertyDetails, defaultMarketData, defaultCostStructure } from '../config/defaults';

const STORAGE_KEY = 'propertyCalculator';

interface PersistedState {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  costStructure: CostStructure;
}

export function getStoredState(): PersistedState | null {
  const persistedState = localStorage.getItem(STORAGE_KEY);
  if (persistedState) {
    try {
      const parsed = JSON.parse(persistedState) as PersistedState;
      // Merge with defaults to ensure all required fields exist
      return {
        propertyDetails: {
          ...defaultPropertyDetails,
          ...parsed.propertyDetails,
          // Ensure nested objects are properly merged
          managementFee: {
            ...defaultPropertyDetails.managementFee,
            ...(parsed.propertyDetails.managementFee || {})
          },
          offsetContribution: {
            ...defaultPropertyDetails.offsetContribution,
            ...(parsed.propertyDetails.offsetContribution || {})
          },
          // Preserve interest rate changes if they exist
          interestRateChanges: parsed.propertyDetails.interestRateChanges
        },
        marketData: {
          ...defaultMarketData,
          ...parsed.marketData
        },
        costStructure: {
          ...defaultCostStructure,
          ...parsed.costStructure,
          // Ensure nested objects are properly merged
          purchaseCosts: {
            ...defaultCostStructure.purchaseCosts,
            ...(parsed.costStructure.purchaseCosts || {})
          }
        }
      };
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
  }
  return null;
}

interface UseFormPersistenceProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
  marketData: MarketData;
  setMarketData: (data: MarketData) => void;
  costStructure: CostStructure;
  updateCostStructure: (costs: Partial<CostStructure>) => void;
}

export function useFormPersistence({
  propertyDetails,
  setPropertyDetails,
  marketData,
  setMarketData,
  costStructure,
  updateCostStructure,
}: UseFormPersistenceProps) {
  // Save state changes to localStorage
  useEffect(() => {
    const state: PersistedState = {
      propertyDetails,
      marketData,
      costStructure,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [propertyDetails, marketData, costStructure]);

  // Reset form to defaults
  const resetToDefaults = () => {
    setPropertyDetails(defaultPropertyDetails);
    setMarketData(defaultMarketData);
    updateCostStructure(defaultCostStructure);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    resetToDefaults,
  };
}
