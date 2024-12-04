import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Home, TrendingUp, CreditCard, DollarSign } from 'lucide-react';
import { PropertyDetails, MarketData, CostStructure, PurchaseCosts, CalculationResults } from '../types';
import { MarketDataForm } from './MarketDataForm';
import { PurchaseCostsForm } from './PurchaseCostsForm';
import { CostStructureForm } from './CostStructureForm';
import { CalculatorLayout } from './CalculatorLayout';
import { ComponentId } from '../hooks/useComponentOrder';
import { cn } from '../../../lib/utils';

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
      <TabsList className="flex w-full bg-slate-100/80 backdrop-blur supports-[backdrop-filter]:bg-slate-100/80 p-1 rounded-lg">
        <TabsTrigger 
          value="property" 
          className={cn(
            "flex-1",
            "px-2 py-1.5 text-xs sm:text-sm font-medium",
            "rounded-md transition-all duration-200",
            "text-slate-700 hover:text-slate-900",
            "data-[state=active]:bg-white",
            "data-[state=active]:text-slate-900",
            "data-[state=active]:shadow-sm",
            "data-[state=active]:ring-1",
            "data-[state=active]:ring-slate-200/50",
            "mx-0.5",
            "flex items-center justify-center gap-1.5"
          )}
        >
          <Home className="h-4 w-4" />
          <span className="sm:hidden">Overview</span>
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger 
          value="market"
          className={cn(
            "flex-1",
            "px-2 py-1.5 text-xs sm:text-sm font-medium",
            "rounded-md transition-all duration-200",
            "text-slate-700 hover:text-slate-900",
            "data-[state=active]:bg-white",
            "data-[state=active]:text-slate-900",
            "data-[state=active]:shadow-sm",
            "data-[state=active]:ring-1",
            "data-[state=active]:ring-slate-200/50",
            "mx-0.5",
            "flex items-center justify-center gap-1.5"
          )}
        >
          <TrendingUp className="h-4 w-4" />
          <span className="sm:hidden">Market</span>
          <span className="hidden sm:inline">Market Conditions</span>
        </TabsTrigger>
        <TabsTrigger 
          value="purchase"
          className={cn(
            "flex-1",
            "px-2 py-1.5 text-xs sm:text-sm font-medium",
            "rounded-md transition-all duration-200",
            "text-slate-700 hover:text-slate-900",
            "data-[state=active]:bg-white",
            "data-[state=active]:text-slate-900",
            "data-[state=active]:shadow-sm",
            "data-[state=active]:ring-1",
            "data-[state=active]:ring-slate-200/50",
            "mx-0.5",
            "flex items-center justify-center gap-1.5"
          )}
        >
          <CreditCard className="h-4 w-4" />
          <span className="sm:hidden">Purchase</span>
          <span className="hidden sm:inline">Purchase Costs</span>
        </TabsTrigger>
        <TabsTrigger 
          value="costs"
          className={cn(
            "flex-1",
            "px-2 py-1.5 text-xs sm:text-sm font-medium",
            "rounded-md transition-all duration-200",
            "text-slate-700 hover:text-slate-900",
            "data-[state=active]:bg-white",
            "data-[state=active]:text-slate-900",
            "data-[state=active]:shadow-sm",
            "data-[state=active]:ring-1",
            "data-[state=active]:ring-slate-200/50",
            "mx-0.5",
            "flex items-center justify-center gap-1.5"
          )}
        >
          <DollarSign className="h-4 w-4" />
          <span className="sm:hidden"> Costs</span>
          <span className="hidden sm:inline">Ownership Costs</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="property">
        <CalculatorLayout
          components={components}
          renderComponent={renderComponent}
        />
      </TabsContent>

      <TabsContent value="market">
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
          <MarketDataForm
            marketData={marketData}
            setMarketData={onMarketDataChange}
          />
        </div>
      </TabsContent>

      <TabsContent value="purchase">
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
          <PurchaseCostsForm
            purchaseCosts={purchaseCosts}
            onConveyancingFeeChange={onConveyancingFeeChange}
            onBuildingAndPestFeeChange={onBuildingAndPestFeeChange}
          />
        </div>
      </TabsContent>

      <TabsContent value="costs">
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
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
