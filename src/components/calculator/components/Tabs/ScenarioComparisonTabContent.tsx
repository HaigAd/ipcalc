import { Scenario } from '../../types/scenario';

interface ScenarioComparisonTabContentProps {
  selectedScenarios: Scenario[];
}

const ScenarioComparisonTabContent = ({ selectedScenarios }: ScenarioComparisonTabContentProps) => {
  return (
    <div>
      {selectedScenarios.length > 0 ? (
        <p>Scenario comparison is available in the dedicated Scenario Comparison tab.</p>
      ) : (
        <p>Select scenarios to compare.</p>
      )}
    </div>
  );
};

export default ScenarioComparisonTabContent;
