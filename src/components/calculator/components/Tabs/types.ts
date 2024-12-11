import { PropertyDetails, MarketData, CostStructure, PurchaseCosts, CalculationResults, AustralianState } from '../../types';
import { ComponentId } from '../../hooks/useComponentOrder';

export interface TabContentProps {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  costStructure: CostStructure;
  purchaseCosts: PurchaseCosts;
  calculationResults: CalculationResults;
  onMarketDataChange: (data: MarketData) => void;
  onConveyancingFeeChange: (fee: number) => void;
  onBuildingAndPestFeeChange: (fee: number) => void;
  onCostStructureChange: (costs: Partial<CostStructure>) => void;
  onStateChange: (state: AustralianState) => void;
  setPropertyDetails: (details: PropertyDetails) => void;
  renderComponent?: (id: ComponentId, extraProps?: any) => React.ReactNode;
  components?: { id: ComponentId; title: string; isFullWidth?: boolean }[];
  onStateClick?: () => void;
  shouldFlash?: boolean;
}
