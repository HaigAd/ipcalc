import { PropertyDetails } from '../types';
import { ManagementFeeSlider } from './ManagementFeeSlider';
import { DepreciationForm } from './DepreciationForm';
import { InvestmentMetrics } from './InvestmentMetrics';
import { useInvestmentMetrics } from '../hooks/useInvestmentMetrics';
import { Card } from '../../ui/card';

interface InvestmentTabProps {
  propertyDetails: PropertyDetails;
  marketData: any;
  costStructure: any;
  calculationResults: any;
  setPropertyDetails: (details: PropertyDetails) => void;
}

export function InvestmentTab({
  propertyDetails,
  marketData,
  costStructure,
  calculationResults,
  setPropertyDetails
}: InvestmentTabProps) {
  const { yearlyProjections, averageROI } = useInvestmentMetrics(
    propertyDetails,
    marketData,
    costStructure,
    calculationResults
  );

  const handleManagementFeeChange = (value: { type: 'percentage' | 'fixed'; value: number }) => {
    setPropertyDetails({
      ...propertyDetails,
      managementFee: value
    });
  };

  const handleDepreciationChange = (changes: {
    capitalWorks?: number;
    plantEquipment?: number;
  }) => {
    const newPropertyDetails = { ...propertyDetails };
    if (changes.capitalWorks !== undefined) {
      newPropertyDetails.capitalWorksDepreciation = changes.capitalWorks;
    }
    if (changes.plantEquipment !== undefined) {
      newPropertyDetails.plantEquipmentDepreciation = changes.plantEquipment;
    }
    setPropertyDetails(newPropertyDetails);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Property Management</h2>
        <ManagementFeeSlider
          propertyDetails={propertyDetails}
          onManagementFeeChange={handleManagementFeeChange}
        />
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Depreciation</h2>
        <DepreciationForm
          propertyDetails={propertyDetails}
          onDepreciationChange={handleDepreciationChange}
        />
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Investment Metrics</h2>
        <InvestmentMetrics
          yearlyProjections={yearlyProjections}
          averageROI={averageROI}
        />
      </Card>
    </div>
  );
}
