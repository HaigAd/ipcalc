import { useState, useMemo } from 'react';
import { MarketScenario, MarketData, PropertyDetails, ScenarioProjection, SensitivityConfig } from '../types';
import { usePropertyProjections } from './usePropertyProjections';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_SENSITIVITY_CONFIG: SensitivityConfig = {
  propertyGrowth: {
    min: -5,
    max: 15,
    step: 0.5,
    defaultValue: 3
  },
  rentIncrease: {
    min: -5,
    max: 15,
    step: 0.5,
    defaultValue: 3
  },
  opportunityCost: {
    min: 0,
    max: 15,
    step: 0.5,
    defaultValue: 5
  },
  interestRate: {
    min: 2,
    max: 12,
    step: 0.25,
    defaultValue: 6
  }
};

const SCENARIO_COLORS = [
  '#2563eb', // blue-600
  '#dc2626', // red-600
  '#16a34a', // green-600
  '#9333ea', // purple-600
  '#ea580c', // orange-600
  '#0891b2', // cyan-600
];

export function useMarketScenarios(propertyDetails: PropertyDetails) {
  const [scenarios, setScenarios] = useState<MarketScenario[]>([]);
  const [sensitivityConfig] = useState<SensitivityConfig>(DEFAULT_SENSITIVITY_CONFIG);

  // Create a new scenario
  const createScenario = (name: string, description: string, marketData: MarketData) => {
    const newScenario: MarketScenario = {
      id: uuidv4(),
      name,
      description,
      marketData,
      color: SCENARIO_COLORS[scenarios.length % SCENARIO_COLORS.length]
    };
    setScenarios([...scenarios, newScenario]);
    return newScenario.id;
  };

  // Update an existing scenario
  const updateScenario = (id: string, updates: Partial<MarketScenario>) => {
    setScenarios(scenarios.map(scenario => 
      scenario.id === id ? { ...scenario, ...updates } : scenario
    ));
  };

  // Delete a scenario
  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter(scenario => scenario.id !== id));
  };

  // Generate sensitivity analysis scenarios
  const generateSensitivityScenarios = (baseMarketData: MarketData, parameter: keyof MarketData) => {
    // Clear existing scenarios
    setScenarios([]);

    // Create pessimistic scenario
    createScenario(
      'Pessimistic',
      'Lower growth and higher costs',
      {
        ...baseMarketData,
        propertyGrowthRate: baseMarketData.propertyGrowthRate - 2,
        rentIncreaseRate: baseMarketData.rentIncreaseRate - 1,
        opportunityCostRate: baseMarketData.opportunityCostRate + 1
      }
    );

    // Create base scenario
    createScenario(
      'Base Case',
      'Current market conditions',
      { ...baseMarketData }
    );

    // Create optimistic scenario
    createScenario(
      'Optimistic',
      'Higher growth and lower costs',
      {
        ...baseMarketData,
        propertyGrowthRate: baseMarketData.propertyGrowthRate + 2,
        rentIncreaseRate: baseMarketData.rentIncreaseRate + 1,
        opportunityCostRate: baseMarketData.opportunityCostRate - 1
      }
    );
  };

  // Calculate projections for all scenarios
  const scenarioProjections = useMemo(() => {
    return scenarios.map(scenario => {
      const { yearlyProjections } = usePropertyProjections(
        {
          ...propertyDetails,
          interestRate: scenario.name === 'Pessimistic' 
            ? propertyDetails.interestRate + 1 
            : scenario.name === 'Optimistic'
              ? propertyDetails.interestRate - 0.5
              : propertyDetails.interestRate
        },
        scenario.marketData
      );

      return {
        scenarioId: scenario.id,
        projections: yearlyProjections
      };
    });
  }, [scenarios, propertyDetails]);

  // Get scenario by ID
  const getScenario = (id: string) => scenarios.find(s => s.id === id);

  return {
    scenarios,
    sensitivityConfig,
    createScenario,
    updateScenario,
    deleteScenario,
    generateSensitivityScenarios,
    scenarioProjections,
    getScenario
  };
}
