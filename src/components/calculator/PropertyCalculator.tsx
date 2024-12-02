import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PropertyDetails, MarketData, CostStructure } from './types';
import { usePropertyCalculator } from './hooks/usePropertyCalculator';
import { useFinancialMetrics } from './hooks/useFinancialMetrics';
import { usePurchaseCosts } from './hooks/usePurchaseCosts';
import { PropertyDetailsForm } from './components/PropertyDetailsForm';
import { MarketDataForm } from './components/MarketDataForm';
import { CostStructureForm } from './components/CostStructureForm';
import { PurchaseCostsForm } from './components/PurchaseCostsForm';
import { KeyMetrics } from './components/KeyMetrics';
import { YearlyProjectionsTable } from './components/YearlyProjectionsTable';
import { PurchaseSummary } from './components/PurchaseSummary';
import { defaultPropertyDetails, defaultMarketData, defaultCostStructure } from './config/defaults';

export function PropertyCalculator() {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>(defaultPropertyDetails);
  const [marketData, setMarketData] = useState<MarketData>(defaultMarketData);
  const [costStructure, setCostStructure] = useState<CostStructure>(defaultCostStructure);
  const [conveyancingFee, setConveyancingFee] = useState(defaultCostStructure.purchaseCosts.conveyancingFee);
  const [buildingAndPestFee, setBuildingAndPestFee] = useState(defaultCostStructure.purchaseCosts.buildingAndPestFee);

  const purchaseCosts = usePurchaseCosts(propertyDetails, conveyancingFee, buildingAndPestFee);
  const calculationResults = usePropertyCalculator(propertyDetails, marketData, costStructure);
  const financialMetrics = useFinancialMetrics(
    propertyDetails,
    marketData,
    costStructure,
    calculationResults.yearlyProjections
  );

  // Update cost structure whenever purchase costs change
  useEffect(() => {
    setCostStructure(prev => ({
      ...prev,
      purchaseCosts
    }));
  }, [purchaseCosts]);

  // Update maintenance cost when property price changes
  useEffect(() => {
    const maintenanceCost = (propertyDetails.purchasePrice * costStructure.maintenancePercentage) / 100;
    const newAnnualPropertyCosts = costStructure.waterCost + costStructure.ratesCost + maintenanceCost + costStructure.insuranceCost;
    
    setCostStructure(prev => ({
      ...prev,
      maintenanceCost,
      annualPropertyCosts: newAnnualPropertyCosts
    }));
  }, [propertyDetails.purchasePrice, costStructure.maintenancePercentage, costStructure.waterCost, costStructure.ratesCost, costStructure.insuranceCost]);

  // Update future sell costs whenever final property value changes
  useEffect(() => {
    if (calculationResults.yearlyProjections.length > 0) {
      const finalPropertyValue = calculationResults.yearlyProjections[calculationResults.yearlyProjections.length - 1].propertyValue;
      const newFutureSellCosts = (finalPropertyValue * costStructure.futureSellCostsPercentage) / 100;
      
      if (newFutureSellCosts !== costStructure.futureSellCosts) {
        setCostStructure(prev => ({
          ...prev,
          futureSellCosts: newFutureSellCosts
        }));
      }
    }
  }, [calculationResults.yearlyProjections, costStructure.futureSellCostsPercentage]);
  
  // Update cost structure whenever purchase costs change
  const updateCostStructure = (costs: Partial<CostStructure>) => {
    const newCostStructure = {
      ...costStructure,
      ...costs,
      purchaseCosts: purchaseCosts
    };

    // If futureSellCostsPercentage is updated, recalculate futureSellCosts
    if (costs.futureSellCostsPercentage !== undefined && calculationResults.yearlyProjections.length > 0) {
      const finalPropertyValue = calculationResults.yearlyProjections[calculationResults.yearlyProjections.length - 1].propertyValue;
      newCostStructure.futureSellCosts = (finalPropertyValue * costs.futureSellCostsPercentage) / 100;
    }

    setCostStructure(newCostStructure);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 tracking-tight">
          Property Investment Calculator
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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

            <TabsContent value="property" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <PropertyDetailsForm
                      propertyDetails={propertyDetails}
                      setPropertyDetails={setPropertyDetails}
                      purchaseCosts={purchaseCosts}
                    />
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <PurchaseSummary
                      propertyDetails={propertyDetails}
                      marketData={marketData}
                      purchaseCosts={purchaseCosts}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <KeyMetrics
                      calculationResults={calculationResults}
                      financialMetrics={financialMetrics}
                      costStructure={costStructure}
                    />
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                    <YearlyProjectionsTable
                      yearlyProjections={calculationResults.yearlyProjections}
                      propertyDetails={propertyDetails}
                      marketData={marketData}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="market">
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <MarketDataForm
                  marketData={marketData}
                  setMarketData={setMarketData}
                />
              </div>
            </TabsContent>

            <TabsContent value="purchase">
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <PurchaseCostsForm
                  purchaseCosts={purchaseCosts}
                  onConveyancingFeeChange={setConveyancingFee}
                  onBuildingAndPestFeeChange={setBuildingAndPestFee}
                />
              </div>
            </TabsContent>

            <TabsContent value="costs">
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                <CostStructureForm
                  costStructure={costStructure}
                  setCostStructure={updateCostStructure}
                  yearlyProjections={calculationResults.yearlyProjections}
                  propertyDetails={propertyDetails}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
