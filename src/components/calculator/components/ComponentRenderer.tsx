import { ComponentId } from '../hooks/useComponentOrder';
import { useCalculator } from '../context/CalculatorContext';
import { PropertyPriceForm } from './PropertyPriceForm';
import { LoanDetailsForm } from './LoanDetailsForm';
import { ProjectionsGraph } from './ProjectionsGraph';
import { YearlyProjectionsTable } from './YearlyProjectionsTable';
import { TaxImplications } from './TaxImplications';
import { YearlyProjection } from '../types';

interface ComponentRendererProps {
  id: ComponentId;
  extraProps?: any;
}

export function ComponentRenderer({ id, extraProps }: ComponentRendererProps) {
  const {
    propertyDetails,
    setPropertyDetails,
    marketData,
    costStructure,
    calculationResults,
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
            <ProjectionsGraph 
              yearlyProjections={calculationResults.yearlyProjections}
            />
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
              yearlyProjections={calculationResults.yearlyProjections.map((proj: YearlyProjection) => ({
                taxBenefit: proj.taxBenefit,
                taxableIncome: proj.taxableIncome
              }))}
              propertyDetails={propertyDetails}
              onPropertyDetailsChange={setPropertyDetails}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return renderContent();
}
