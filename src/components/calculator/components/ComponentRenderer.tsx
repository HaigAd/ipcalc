import { ComponentId } from '../hooks/useComponentOrder';
import { useCalculator } from '../context/CalculatorContext';
import { PropertyPriceForm } from './PropertyPriceForm';
import { LoanDetailsForm } from './LoanDetailsForm';

interface ComponentRendererProps {
  id: ComponentId;
  extraProps?: any;
}

export function ComponentRenderer({ id, extraProps }: ComponentRendererProps) {
  const {
    propertyDetails,
    setPropertyDetails,
    costStructure,
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
      default:
        return null;
    }
  };

  return renderContent();
}
