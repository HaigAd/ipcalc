import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Home, TrendingUp, CreditCard, DollarSign, PiggyBank } from 'lucide-react';
import { PropertyDetails, MarketData, CostStructure, PurchaseCosts, CalculationResults, AustralianState } from '../types';
import { MarketDataForm } from './MarketDataForm';
import { PurchaseCostsForm } from './PurchaseCostsForm';
import { CostStructureForm } from './CostStructureForm';
import { CalculatorLayout } from './CalculatorLayout';
import { ComponentId } from '../hooks/useComponentOrder';
import { cn } from '../../../lib/utils';
import { InvestmentTab } from './InvestmentTab';

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
  onStateChange: (state: AustralianState) => void;
  renderComponent: (id: ComponentId, extraProps?: any) => React.ReactNode;
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
  onStateChange,
  renderComponent
}: CalculatorTabsProps) {
  const [activeTab, setActiveTab] = useState('property');
  const [shouldFlashStateSelector, setShouldFlashStateSelector] = useState(false);

  const navigateToPurchaseTab = useCallback(() => {
    setActiveTab('purchase');
    setShouldFlashStateSelector(true);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset flash state when changing tabs directly
    setShouldFlashStateSelector(false);
  };

  const renderPropertyTab = useCallback(() => {
    return (
      <CalculatorLayout
        components={components}
        renderComponent={(id) => renderComponent(id, id === 'price' ? { onStateClick: navigateToPurchaseTab } : undefined)}
      />
    );
  }, [components, renderComponent, navigateToPurchaseTab]);

  // Get the price component to extract setPropertyDetails
  const priceComponent = renderComponent('price') as React.ReactElement;
  const setPropertyDetails = priceComponent.props.setPropertyDetails;

  return (
    <>
      <style>
        {`
          @keyframes flash {
            0% { background-color: transparent; }
            50% { background-color: rgba(59, 130, 246, 0.1); }
            100% { background-color: transparent; }
          }
          .flash-highlight {
            animation: flash 2s ease-out;
          }
        `}
      </style>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
            <span className="sm:hidden">Costs</span>
            <span className="hidden sm:inline">Ownership Costs</span>
          </TabsTrigger>
          <TabsTrigger 
            value="investment"
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
            <PiggyBank className="h-4 w-4" />
            <span className="sm:hidden">Investment</span>
            <span className="hidden sm:inline">Investment</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="property">
          {renderPropertyTab()}
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
              onStateChange={onStateChange}
              shouldFlash={shouldFlashStateSelector}
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

        <TabsContent value="investment">
          <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
            <InvestmentTab
              propertyDetails={propertyDetails}
              marketData={marketData}
              costStructure={costStructure}
              calculationResults={calculationResults}
              setPropertyDetails={setPropertyDetails}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
