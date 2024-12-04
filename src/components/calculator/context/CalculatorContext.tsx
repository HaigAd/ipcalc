import { createContext, useContext, ReactNode } from 'react';
import { PropertyDetails, MarketData, CostStructure, MarketScenario } from '../types';
import { usePropertyState } from '../hooks/state/usePropertyState';
import { useMarketState } from '../hooks/state/useMarketState';
import { useCostState } from '../hooks/state/useCostState';
import { usePropertyCalculator } from '../hooks/usePropertyCalculator';

type CalculatorContextType = {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
  marketData: MarketData;
  setMarketData: (data: MarketData) => void;
  costStructure: CostStructure;
  updateCostStructure: (costs: Partial<CostStructure>) => void;
  conveyancingFee: number;
  setConveyancingFee: (fee: number) => void;
  buildingAndPestFee: number;
  setBuildingAndPestFee: (fee: number) => void;
  scenarios: MarketScenario[];
  setScenarios: (scenarios: MarketScenario[]) => void;
  calculationResults: any; // TODO: Add proper type
  resetToDefaults: () => void;
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const propertyState = usePropertyState();
  const marketState = useMarketState();
  const costState = useCostState(propertyState.propertyDetails);
  
  const calculationResults = usePropertyCalculator(
    propertyState.propertyDetails,
    marketState.marketData,
    costState.costStructure,
    marketState.scenarios
  );

  // Update cost state with projections after calculations
  const costStateWithProjections = useCostState(
    propertyState.propertyDetails,
    calculationResults.yearlyProjections
  );

  const resetToDefaults = () => {
    // TODO: Implement reset functionality
  };

  const value = {
    ...propertyState,
    ...marketState,
    ...costStateWithProjections,
    calculationResults,
    resetToDefaults,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

export type { CalculatorContextType };
