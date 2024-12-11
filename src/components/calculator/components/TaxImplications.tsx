import { CalculationResults, PropertyDetails, MarketData } from '../types';
import { TaxableIncomeInput } from './TaxableIncomeInput';

interface TaxImplicationsProps {
  yearlyProjections: CalculationResults['yearlyProjections'];
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
}

export function TaxImplications({ 
  propertyDetails,
  onPropertyDetailsChange 
}: TaxImplicationsProps) {
  return (
    <div>
      <TaxableIncomeInput 
        propertyDetails={propertyDetails}
        onPropertyDetailsChange={onPropertyDetailsChange}
      />
    </div>
  );
}
