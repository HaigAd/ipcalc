import { ComponentId } from '../hooks/useComponentOrder';
import { useCalculator } from '../context/CalculatorContext';
import { PropertyPriceForm } from './PropertyPriceForm';
import { LoanDetailsForm } from './LoanDetailsForm';
import { KeyMetrics } from './KeyMetrics';
import { ProjectionsGraph } from './ProjectionsGraph';
import { YearlyProjectionsTable } from './YearlyProjectionsTable';
import { MarketScenarios } from './MarketScenarios';

interface ComponentRendererProps {
  id: ComponentId;
}

export function ComponentRenderer({ id }: ComponentRendererProps) {
  const {
    propertyDetails,
    setPropertyDetails,
    marketData,
    costStructure,
    calculationResults,
    scenarios,
    setScenarios,
  } = useCalculator();

  const renderContent = () => {
    switch (id) {
      case 'price':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Property Price & Deposit</h2>
            <PropertyPriceForm
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              purchaseCosts={costStructure.purchaseCosts}
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
      case 'scenarios':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Market Scenarios</h2>
            <MarketScenarios
              propertyDetails={propertyDetails}
              baseMarketData={marketData}
              scenarios={scenarios}
              onScenarioChange={setScenarios}
            />
          </div>
        );
      case 'graph':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Financial Projections</h2>
            <ProjectionsGraph 
              yearlyProjections={calculationResults.yearlyProjections}
              scenarios={scenarios}
              scenarioProjections={calculationResults.scenarioProjections}
            />
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
      default:
        return null;
    }
  };

  return renderContent();
}
