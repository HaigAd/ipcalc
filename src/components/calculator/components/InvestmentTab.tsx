import { PropertyDetails, MarketData, CostStructure, CalculationResults } from '../types';
import { ManagementFeeSlider } from './ManagementFeeSlider';
import { InvestmentRentInput } from './InvestmentRentInput';
import { Card } from '../../ui/card';

interface InvestmentTabProps {
  propertyDetails: PropertyDetails;
  calculationResults: CalculationResults;
  setPropertyDetails: (details: PropertyDetails) => void;
}

export function InvestmentTab({
  propertyDetails,
  calculationResults,
  setPropertyDetails
}: InvestmentTabProps) {
  const handleInvestmentRentChange = (value: number) => {
    setPropertyDetails({
      ...propertyDetails,
      investmentRent: value
    });
  };

  const handleManagementFeeChange = (value: { type: 'percentage' | 'fixed'; value: number }) => {
    setPropertyDetails({
      ...propertyDetails,
      managementFee: value
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          {propertyDetails.isPPOR ? 'Rent Savings' : 'Rental Income'}
        </h2>
        <InvestmentRentInput
          propertyDetails={propertyDetails}
          onInvestmentRentChange={handleInvestmentRentChange}
        />
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Property Management</h2>
        <ManagementFeeSlider
          propertyDetails={propertyDetails}
          onManagementFeeChange={handleManagementFeeChange}
          disabled={propertyDetails.isPPOR}
        />
      </Card>
    </div>
  );
}
