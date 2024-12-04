import { PropertyDetails, PurchaseCosts } from '../types';
import { PropertyPriceForm } from './PropertyPriceForm';
import { LoanDetailsForm } from './LoanDetailsForm';

interface PropertyDetailsFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
  purchaseCosts: PurchaseCosts;
}

export function PropertyDetailsForm({ propertyDetails, setPropertyDetails, purchaseCosts }: PropertyDetailsFormProps) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-900">Property Details</h2>
      <div className="space-y-6 sm:space-y-8">
        <PropertyPriceForm
          propertyDetails={propertyDetails}
          setPropertyDetails={setPropertyDetails}
          purchaseCosts={purchaseCosts}
        />
        <LoanDetailsForm
          propertyDetails={propertyDetails}
          setPropertyDetails={setPropertyDetails}
        />
      </div>
    </div>
  );
}
