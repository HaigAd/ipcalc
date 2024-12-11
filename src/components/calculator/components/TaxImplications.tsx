import { CalculationResults, PropertyDetails, MarketData } from '../types';

interface TaxImplicationsProps {
  yearlyProjections: CalculationResults['yearlyProjections'];
  propertyDetails: PropertyDetails;
  marketData: MarketData;
}

export function TaxImplications({ yearlyProjections, propertyDetails }: TaxImplicationsProps) {
  if (!yearlyProjections.length) return null;

  const latestYear = yearlyProjections[yearlyProjections.length - 1];
  const firstYear = yearlyProjections[0];

  const totalDepreciation = yearlyProjections.reduce(
    (sum, projection) => sum + projection.totalDepreciation,
    0
  );

  const totalTaxBenefit = yearlyProjections.reduce(
    (sum, projection) => sum + projection.taxBenefit,
    0
  );

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded-md text-sm">
      <p className="font-medium mb-1">Investment Property Tax Benefits:</p>
      
      <div className="mt-2">
        <p>Annual Depreciation: ${Math.round(propertyDetails.capitalWorksDepreciation + propertyDetails.plantEquipmentDepreciation).toLocaleString()}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          - Capital Works: ${Math.round(propertyDetails.capitalWorksDepreciation).toLocaleString()}/year
        </p>
        <p className="text-xs text-gray-500">
          - Plant & Equipment: ${Math.round(propertyDetails.plantEquipmentDepreciation).toLocaleString()}/year
        </p>
      </div>

      <div className="mt-3">
        <p>First Year Tax Position:</p>
        <p className="text-xs text-gray-500 mt-0.5">
          - Taxable Income: ${Math.round(firstYear.taxableIncome).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">
          - Tax Benefit: ${Math.round(firstYear.taxBenefit).toLocaleString()}
        </p>
      </div>

      <div className="mt-3">
        <p>Cumulative Benefits:</p>
        <p className="text-xs text-gray-500 mt-0.5">
          - Total Depreciation: ${Math.round(totalDepreciation).toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">
          - Total Tax Benefits: ${Math.round(totalTaxBenefit).toLocaleString()}
        </p>
      </div>

      <p className="mt-3 text-xs italic">
        Note: Tax benefits are calculated based on your marginal tax rate and include both depreciation and negative gearing benefits.
      </p>
    </div>
  );
}
