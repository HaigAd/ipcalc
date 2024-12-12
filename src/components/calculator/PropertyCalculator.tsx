import { useComponentOrder } from './hooks/useComponentOrder';
import { useCalculatorState } from './hooks/useCalculatorState';
import { PropertyPriceForm } from './components/PropertyPriceForm';
import { LoanDetailsForm } from './components/LoanDetailsForm';
import { ProjectionsGraph } from './components/ProjectionsGraph';
import { YearlyProjectionsTable } from './components/YearlyProjectionsTable';
import { CalculatorTabs } from './components/CalculatorTabs';
import { ComponentId } from './hooks/useComponentOrder';
import { useCallback } from 'react';
import { TaxImplications } from './components/TaxImplications/index';
import { CombinedMetrics } from './components/CombinedMetrics';

export function PropertyCalculator() {
  const {
    propertyDetails,
    setPropertyDetails,
    marketData,
    setMarketData,
    costStructure,
    updateCostStructure,
    setConveyancingFee,
    setBuildingAndPestFee,
    purchaseCosts,
    calculationResults,
    resetToDefaults,
    setState
  } = useCalculatorState();

  const { components } = useComponentOrder();

  const renderComponent = useCallback((id: ComponentId, extraProps?: any) => {
    switch (id) {
      case 'price':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Property Price & Deposit</h2>
            <PropertyPriceForm
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              purchaseCosts={purchaseCosts}
              onStateClick={extraProps?.onStateClick}
            />
          </div>
        );
      case 'loan':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Loan Details & Options</h2>
            <LoanDetailsForm
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              costStructure={costStructure}
            />
          </div>
        );
      case 'graph':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Financial Projections</h2>
            <ProjectionsGraph yearlyProjections={calculationResults.yearlyProjections} />
          </div>
        );
      case 'table':
        return (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <YearlyProjectionsTable
              yearlyProjections={calculationResults.yearlyProjections}
              marketData={marketData}
            />
          </div>
        );
      case 'taxImplications':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Tax & Depreciation</h2>
            <TaxImplications
              yearlyProjections={calculationResults.yearlyProjections.map(proj => ({
                taxBenefit: proj.taxBenefit,
                taxableIncome: proj.taxableIncome
              }))}
              propertyDetails={propertyDetails}
              onPropertyDetailsChange={setPropertyDetails}
            />
          </div>
        );
    }
  }, [propertyDetails, setPropertyDetails, marketData, costStructure, calculationResults, purchaseCosts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Property Investment Calculator
          </h1>
          <button
            onClick={resetToDefaults}
            className="inline-flex items-center gap-2 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg shadow-sm hover:from-slate-100 hover:to-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Reset Calculator
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <CalculatorTabs
            propertyDetails={propertyDetails}
            marketData={marketData}
            costStructure={costStructure}
            purchaseCosts={purchaseCosts}
            calculationResults={calculationResults}
            components={components}
            onMarketDataChange={setMarketData}
            onConveyancingFeeChange={setConveyancingFee}
            onBuildingAndPestFeeChange={setBuildingAndPestFee}
            onCostStructureChange={updateCostStructure}
            onStateChange={setState}
            setPropertyDetails={setPropertyDetails}
            renderComponent={renderComponent}
          />

          <CombinedMetrics 
            calculationResults={calculationResults}
            costStructure={costStructure}
          />
        </div>
      </div>
    </div>
  );
}
