import { 
  PropertyDetails, 
  CostStructure,
  MarketScenario
} from '../../types';
import { calculateBaseProjections } from './baseProjections';

export function calculateScenarioProjections(
  propertyDetails: PropertyDetails,
  costStructure: CostStructure,
  scenarios: MarketScenario[]
) {
  if (!scenarios?.length) return undefined;

  return scenarios.map(scenario => {
    const scenarioResults = calculateBaseProjections(
      propertyDetails,
      scenario.marketData,
      costStructure
    );
    
    return {
      scenarioId: scenario.id,
      projections: scenarioResults.yearlyProjections
    };
  });
}
