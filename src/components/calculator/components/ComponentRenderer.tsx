import { ComponentId } from '../hooks/useComponentOrder';
import { PropertyPriceForm } from './PropertyPriceForm';
import { LoanDetailsForm } from './LoanDetailsForm';
import { TaxImplications } from './TaxImplications';
import { PropertyDetails, CostStructure } from '../types';
import { RenderComponentExtraProps } from './Tabs';

interface ComponentRendererProps {
  id: ComponentId;
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
  costStructure: CostStructure;
  extraProps?: RenderComponentExtraProps;
}

export function ComponentRenderer({ 
  id, 
  propertyDetails,
  setPropertyDetails,
  costStructure,
  extraProps 
}: ComponentRendererProps) {
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
      case 'taxImplications':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6 text-slate-900">Tax Implications</h2>
            <TaxImplications
              propertyDetails={propertyDetails}
              yearlyProjections={extraProps?.yearlyProjections || []}
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
