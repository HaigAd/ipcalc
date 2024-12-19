import React from 'react';
import { useScenarios } from '../../hooks/useScenarios';
import { usePropertyCalculator } from '../../hooks/usePropertyCalculator';
import { ProjectionsGraph } from '../ProjectionsGraph';
import { useCalculatorState } from '../../hooks/useCalculatorState';
import { Scenario } from '../../types/scenario';

interface ScenarioComparisonTabContentProps {
  selectedScenarios: Scenario[];
}

const ScenarioComparisonTabContent: React.FC<ScenarioComparisonTabContentProps> = ({
  selectedScenarios,
}) => {
  const {
    propertyDetails,
    marketData,
    costStructure,
    state,
    setPropertyDetails,
    setMarketData,
    updateCostStructure,
    setState,
  } = useCalculatorState();

  const { scenarios } = useScenarios({
    propertyDetails,
    marketData,
    costStructure,
    state,
    setPropertyDetails,
    setMarketData,
    updateCostStructure,
    setState,
  });

  const { calculatePropertyProjections: calculateProjections } = usePropertyCalculator();

  const scenarioProjections = selectedScenarios.map((scenario) => ({
    id: scenario.id,
    projections: calculateProjections(
      scenario.state.propertyDetails,
      scenario.state.marketData,
      scenario.state.costStructure,
      scenario.state.state
    ),
  }));

  return (
    <div>
      {selectedScenarios.length > 0 ? (
        <ProjectionsGraph calculationResults={scenarioProjections[0].projections} />
      ) : (
        <p>Select scenarios to compare.</p>
      )}
    </div>
  );
};

export default ScenarioComparisonTabContent;
