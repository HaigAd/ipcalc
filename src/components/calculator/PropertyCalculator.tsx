import { useComponentOrder } from './hooks/useComponentOrder';
import { useCalculatorState } from './hooks/useCalculatorState';
import { PropertyPriceForm } from './components/PropertyPriceForm';
import { LoanDetailsForm } from './components/LoanDetailsForm';
import { KeyMetrics } from './components/KeyMetrics';
import { ProjectionsGraph } from './components/ProjectionsGraph';
import { YearlyProjectionsTable } from './components/YearlyProjectionsTable';
import { CalculatorTabs } from './components/CalculatorTabs';
import { ComponentId } from './hooks/useComponentOrder';

export function PropertyCalculator() {
  const {
    propertyDetails,
    setPropertyDetails,
    marketData,
    setMarketData,
    costStructure,
    updateCostStructure,
    conveyancingFee,
    setConveyancingFee,
    buildingAndPestFee,
    setBuildingAndPestFee,
    purchaseCosts,
    calculationResults
  } = useCalculatorState();

  const { components } = useComponentOrder();

  const renderComponent = (id: ComponentId) => {
    switch (id) {
      case 'price':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Property Price & Deposit</h2>
            <PropertyPriceForm
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              purchaseCosts={purchaseCosts}
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
            />
          </div>
        );
      case 'metrics':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <KeyMetrics
              calculationResults={calculationResults}
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
              propertyDetails={propertyDetails}
              marketData={marketData}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 tracking-tight">
          Property Investment Calculator
        </h1>
        
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
            renderComponent={renderComponent}
          />
        </div>
      </div>
    </div>
  );
}
