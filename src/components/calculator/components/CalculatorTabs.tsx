import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { PropertyDetails, MarketData, CostStructure, PurchaseCosts, CalculationResults } from '../types';
import { MarketDataForm } from './MarketDataForm';
import { PurchaseCostsForm } from './PurchaseCostsForm';
import { CostStructureForm } from './CostStructureForm';
import { CalculatorLayout } from './CalculatorLayout';
import { ComponentId } from '../hooks/useComponentOrder';

interface CalculatorTabsProps {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  costStructure: CostStructure;
  purchaseCosts: PurchaseCosts;
  calculationResults: CalculationResults;
  components: { id: ComponentId; title: string; isFullWidth?: boolean }[];
  onMarketDataChange: (data: MarketData) => void;
  onConveyancingFeeChange: (fee: number) => void;
  onBuildingAndPestFeeChange: (fee: number) => void;
  onCostStructureChange: (costs: Partial<CostStructure>) => void;
  renderComponent: (id: ComponentId) => React.ReactNode;
}

export function CalculatorTabs({
  propertyDetails,
  marketData,
  costStructure,
  purchaseCosts,
  calculationResults,
  components,
  onMarketDataChange,
  onConveyancingFeeChange,
  onBuildingAndPestFeeChange,
  onCostStructureChange,
  renderComponent
}: CalculatorTabsProps) {
  return (
    <Tabs defaultValue="property" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-100 p-1 rounded-lg">
        <TabsTrigger 
          value="property" 
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md"
        >
          Property Details
        </TabsTrigger>
        <TabsTrigger 
          value="market"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md"
        >
          Market Data
        </TabsTrigger>
        <TabsTrigger 
          value="purchase"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md"
        >
          Purchase Costs
        </TabsTrigger>
        <TabsTrigger 
          value="costs"
          className="data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md"
        >
          Cost Structure
        </TabsTrigger>
      </TabsList>

      <TabsContent value="property">
        <CalculatorLayout
          components={components}
          renderComponent={renderComponent}
        />
      </TabsContent>

      <TabsContent value="market">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <MarketDataForm
            marketData={marketData}
            setMarketData={onMarketDataChange}
          />
        </div>
      </TabsContent>

      <TabsContent value="purchase">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <PurchaseCostsForm
            purchaseCosts={purchaseCosts}
            onConveyancingFeeChange={onConveyancingFeeChange}
            onBuildingAndPestFeeChange={onBuildingAndPestFeeChange}
          />
        </div>
      </TabsContent>

      <TabsContent value="costs">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <CostStructureForm
            costStructure={costStructure}
            setCostStructure={onCostStructureChange}
            yearlyProjections={calculationResults.yearlyProjections}
            propertyDetails={propertyDetails}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
