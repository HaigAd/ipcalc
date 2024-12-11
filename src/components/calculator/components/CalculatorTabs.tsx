import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Home, TrendingUp, CreditCard, Receipt, Calculator } from 'lucide-react';
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
  setPropertyDetails: (details: PropertyDetails) => void;
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
  setPropertyDetails,
  renderComponent
}: CalculatorTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [shouldFlashStateSelector, setShouldFlashStateSelector] = useState(false);

  const navigateToPurchaseTab = useCallback(() => {
    setActiveTab('purchase');
    setShouldFlashStateSelector(true);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setShouldFlashStateSelector(false);
  };

  const renderOverviewTab = useCallback(() => {
    return (
      <CalculatorLayout
        components={components}
        renderComponent={(id) => renderComponent(id, id === 'price' ? { onStateClick: navigateToPurchaseTab } : undefined)}
      />
    );
  }, [components, renderComponent, navigateToPurchaseTab]);

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
            value="overview" 
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
            <span className="hidden sm:inline">Investment Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="income"
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
            <Receipt className="h-4 w-4" />
            <span className="sm:hidden">Income</span>
            <span className="hidden sm:inline">Income & Expenses</span>
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
            <span className="hidden sm:inline">Market Analysis</span>
          </TabsTrigger>
          <TabsTrigger 
            value="tax"
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
            <Calculator className="h-4 w-4" />
            <span className="sm:hidden">Tax</span>
            <span className="hidden sm:inline">Tax & Depreciation</span>
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
        </TabsList>

        <TabsContent value="overview">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="income">
          <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
            <div className="space-y-6">
              <InvestmentTab
                propertyDetails={propertyDetails}
                marketData={marketData}
                costStructure={costStructure}
                calculationResults={calculationResults}
                setPropertyDetails={setPropertyDetails}
              />
              <CostStructureForm
                costStructure={costStructure}
                setCostStructure={onCostStructureChange}
                yearlyProjections={calculationResults.yearlyProjections}
                propertyDetails={propertyDetails}
                marketData={marketData}
                setMarketData={onMarketDataChange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="market">
          <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
            <MarketDataForm
              marketData={marketData}
              setMarketData={onMarketDataChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="tax">
          <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
            {renderComponent('taxImplications')}
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
      </Tabs>
    </>
  );
}
