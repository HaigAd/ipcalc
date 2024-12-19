import { useState, useEffect, useMemo } from 'react';
import { Scenario, ScenariosState } from '../types/scenario';
import { PropertyDetails, MarketData, CostStructure, AustralianState } from '../types';
import { defaultPropertyDetails, defaultMarketData, defaultCostStructure } from '../config/defaults';

const STORAGE_KEY = 'calculator_scenarios';

interface UseScenarioProps {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  costStructure: CostStructure;
  state: AustralianState;
  setPropertyDetails: (details: PropertyDetails) => void;
  setMarketData: (data: MarketData) => void;
  updateCostStructure: (costs: Partial<CostStructure>) => void;
  setState: (state: AustralianState) => void;
}

const getStateSnapshot = (
  propertyDetails: PropertyDetails,
  marketData: MarketData,
  costStructure: CostStructure,
  state: AustralianState
) => {
  return JSON.stringify({ propertyDetails, marketData, costStructure, state });
};

export function useScenarios({
  propertyDetails,
  marketData,
  costStructure,
  state,
  setPropertyDetails,
  setMarketData,
  updateCostStructure,
  setState,
}: UseScenarioProps) {
  const [scenariosState, setScenariosState] = useState<ScenariosState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { scenarios: [], activeScenarioId: null };
  });

  // Track the last saved state for the active scenario
  const [lastSavedState, setLastSavedState] = useState<string | null>(null);

  // Persist scenarios to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenariosState));
  }, [scenariosState]);

  // Update lastSavedState when loading a scenario
  useEffect(() => {
    if (scenariosState.activeScenarioId) {
      const activeScenario = scenariosState.scenarios.find(
        s => s.id === scenariosState.activeScenarioId
      );
      if (activeScenario) {
        setLastSavedState(getStateSnapshot(
          activeScenario.state.propertyDetails,
          activeScenario.state.marketData,
          activeScenario.state.costStructure,
          activeScenario.state.state
        ));
      }
    } else {
      setLastSavedState(null);
    }
  }, [scenariosState.activeScenarioId, scenariosState.scenarios]);

  // Check if current state differs from last saved state
  const hasChanges = useMemo(() => {
    if (!scenariosState.activeScenarioId) return false;
    
    const currentState = getStateSnapshot(propertyDetails, marketData, costStructure, state);
    return currentState !== lastSavedState;
  }, [propertyDetails, marketData, costStructure, state, lastSavedState, scenariosState.activeScenarioId]);

  const saveScenario = (name: string) => {
    const newScenario: Scenario = {
      id: crypto.randomUUID(),
      name,
      timestamp: Date.now(),
      state: {
        propertyDetails,
        marketData,
        costStructure,
        state,
      },
    };

    setScenariosState(prev => ({
      ...prev,
      scenarios: [...prev.scenarios, newScenario],
      activeScenarioId: newScenario.id,
    }));

    setLastSavedState(getStateSnapshot(propertyDetails, marketData, costStructure, state));
    return newScenario;
  };

  const updateScenario = () => {
    if (!scenariosState.activeScenarioId) return;

    setScenariosState(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s => 
        s.id === prev.activeScenarioId
          ? {
              ...s,
              timestamp: Date.now(),
              state: {
                propertyDetails,
                marketData,
                costStructure,
                state,
              },
            }
          : s
      ),
    }));

    setLastSavedState(getStateSnapshot(propertyDetails, marketData, costStructure, state));
  };

  const loadScenario = (id: string) => {
    const scenario = scenariosState.scenarios.find(s => s.id === id);
    if (!scenario) return;

    setPropertyDetails(scenario.state.propertyDetails);
    setMarketData(scenario.state.marketData);
    updateCostStructure(scenario.state.costStructure);
    setState(scenario.state.state);

    setScenariosState(prev => ({
      ...prev,
      activeScenarioId: id,
    }));

    setLastSavedState(getStateSnapshot(
      scenario.state.propertyDetails,
      scenario.state.marketData,
      scenario.state.costStructure,
      scenario.state.state
    ));
  };

  const deleteScenario = (id: string) => {
    setScenariosState(prev => {
      const isActive = prev.activeScenarioId === id;
      
      // If deleting active scenario, reset to defaults
      if (isActive) {
        setPropertyDetails(defaultPropertyDetails);
        setMarketData(defaultMarketData);
        updateCostStructure(defaultCostStructure);
        setState(defaultCostStructure.purchaseCosts.state);
        setLastSavedState(null);
      }

      return {
        scenarios: prev.scenarios.filter(s => s.id !== id),
        activeScenarioId: isActive ? null : prev.activeScenarioId,
      };
    });
  };

  const updateScenarioName = (id: string, name: string) => {
    setScenariosState(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s => 
        s.id === id ? { ...s, name } : s
      ),
    }));
  };

  const activeScenario = scenariosState.scenarios.find(
    s => s.id === scenariosState.activeScenarioId
  );

  return {
    scenarios: scenariosState.scenarios,
    activeScenarioId: scenariosState.activeScenarioId,
    activeScenario,
    hasChanges,
    saveScenario,
    updateScenario,
    loadScenario,
    deleteScenario,
    updateScenarioName,
  };
}
