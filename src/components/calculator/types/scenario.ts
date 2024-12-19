import { PropertyDetails, MarketData, CostStructure, AustralianState } from './index';

export interface Scenario {
  id: string;
  name: string;
  timestamp: number;
  state: {
    propertyDetails: PropertyDetails;
    marketData: MarketData;
    costStructure: CostStructure;
    state: AustralianState;
  };
}

export interface ScenariosState {
  scenarios: Scenario[];
  activeScenarioId: string | null;
}
