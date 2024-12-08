import { CalculationResults, PropertyDetails, MarketData } from '../types';

interface TaxImplicationsProps {
  yearlyProjections: CalculationResults['yearlyProjections'];
  propertyDetails: PropertyDetails;
  marketData: MarketData;
}

export function TaxImplications({ yearlyProjections, propertyDetails, marketData }: TaxImplicationsProps) {
  const totalCGT = propertyDetails.considerPPORTax
    ? yearlyProjections
        .slice(0, 6) // Only first 6 years
        .reduce((sum, projection) => sum + projection.yearlyCGT, 0)
    : 0;

  if (!propertyDetails.considerPPORTax) {
    return null;
  }

  const finalValue = yearlyProjections[5]?.existingPPORValue || propertyDetails.otherPropertyCostBase;
  const totalGain = finalValue - propertyDetails.otherPropertyCostBase;

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded-md text-sm">
      <p className="font-medium mb-1">Tax Implications on change of PPOR:</p>
      <p>Considering loss of "6 year" CGT free period on other residence: </p>
      <p className="mt-1">Total extra CGT over first 6 years: ${Math.round(totalCGT).toLocaleString()}</p>
      <div className="mt-3 text-xs text-gray-500">
        <p className="font-medium">Details:</p>
        <p className="mt-0.5">Cost Base: ${Math.round(propertyDetails.otherPropertyCostBase).toLocaleString()}</p>
        <p className="mt-0.5">Projected Value After 6 Years: ${Math.round(finalValue).toLocaleString()}</p>
        <p className="mt-0.5">Total Capital Gain: ${Math.round(totalGain).toLocaleString()}</p>
        <p className="mt-0.5">Yearly Appreciation: {marketData.propertyGrowthRate.toFixed(1)}%</p>
        <p className="mt-2 text-xs italic">Note: CGT is calculated on all gains from the cost base during the 6 year period. 
          It is assumed that the owner moves back in at 6 years so CGT does not continue to accumulate.
        </p>

      </div>
    </div>
  );
}
