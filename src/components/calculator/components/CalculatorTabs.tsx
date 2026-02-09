import React, { useState, useCallback } from 'react';
import { Tabs, TabsList } from '../../ui/tabs';
import { PropertyDetails, MarketData, CostStructure, PurchaseCosts, CalculationResults, AustralianState } from '../types';
import { ComponentId } from '../hooks/useComponentOrder';
import { Scenario } from '../types/scenario';
import {
  TAB_CONFIG,
  CustomTabTrigger,
  TabContent,
  RenderComponentExtraProps,
  OverviewTabContent,
  IncomeTabContent,
  MarketTabContent,
  TaxTabContent,
  PurchaseTabContent
} from './Tabs';
import ScenarioComparison from './ScenarioComparison';

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
  renderComponent: (id: ComponentId, extraProps?: RenderComponentExtraProps) => React.ReactNode;
  scenarios: Scenario[];
  activeTab?: string;
  onActiveTabChange?: (tabId: string) => void;
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
  renderComponent,
  scenarios,
  activeTab,
  onActiveTabChange,
}: CalculatorTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState('overview');
  const [shouldFlashStateSelector, setShouldFlashStateSelector] = useState(false);
  const [shouldOpenPurchaseDetails, setShouldOpenPurchaseDetails] = useState(false);
  const resolvedActiveTab = activeTab ?? internalActiveTab;
  const setResolvedActiveTab = onActiveTabChange ?? setInternalActiveTab;

  const navigateToPurchaseTab = useCallback(() => {
    setResolvedActiveTab('purchase');
    setShouldFlashStateSelector(true);
    setShouldOpenPurchaseDetails(true);
  }, [setResolvedActiveTab]);

  const handleTabChange = (value: string) => {
    setResolvedActiveTab(value);
    setShouldFlashStateSelector(false);
    if (value !== 'purchase') {
      setShouldOpenPurchaseDetails(false);
    }
  };

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
      <Tabs value={resolvedActiveTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="h-auto min-h-10 flex flex-wrap gap-1 w-full bg-slate-100/80 backdrop-blur supports-[backdrop-filter]:bg-slate-100/80 p-1 rounded-lg">
          {TAB_CONFIG.map(tab => (
            <CustomTabTrigger key={tab.id} tab={tab} />
          ))}
        </TabsList>

        <TabContent value="overview">
          <OverviewTabContent
            components={components}
            renderComponent={renderComponent}
            onStateClick={navigateToPurchaseTab}
          />
        </TabContent>

        <TabContent value="income">
          <IncomeTabContent
            propertyDetails={propertyDetails}
            marketData={marketData}
            costStructure={costStructure}
            calculationResults={calculationResults}
            setPropertyDetails={setPropertyDetails}
            onCostStructureChange={onCostStructureChange}
            onMarketDataChange={onMarketDataChange}
          />
        </TabContent>

        <TabContent value="market">
          <MarketTabContent
            marketData={marketData}
            onMarketDataChange={onMarketDataChange}
          />
        </TabContent>

        <TabContent value="tax">
          <TaxTabContent renderComponent={renderComponent} />
        </TabContent>

        <TabContent value="purchase">
          <PurchaseTabContent
            propertyDetails={propertyDetails}
            setPropertyDetails={setPropertyDetails}
            purchaseCosts={purchaseCosts}
            onConveyancingFeeChange={onConveyancingFeeChange}
            onBuildingAndPestFeeChange={onBuildingAndPestFeeChange}
            onStateChange={onStateChange}
            shouldFlash={shouldFlashStateSelector}
            shouldOpenDetails={shouldOpenPurchaseDetails}
          />
        </TabContent>
        <TabContent value="scenario-comparison">
          <ScenarioComparison scenarios={scenarios} />
        </TabContent>
      </Tabs>
    </>
  );
}
