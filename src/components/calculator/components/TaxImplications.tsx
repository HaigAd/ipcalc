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

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded-md text-sm">
      <p className="font-medium mb-1">Tax Implications:</p>
      <p>Considering loss of "6 year" CGT free period on other residence: </p>
      <p className="mt-1">Total extra CGT over first 6 years: ${Math.round(totalCGT).toLocaleString()}</p>
      <div className="mt-3 text-xs text-gray-500">
        <p className="font-medium">Assumptions:</p>
        <p className="mt-0.5">Other Property Value: ${Math.round(propertyDetails.otherPropertyValue).toLocaleString()}</p>
        <p className="mt-0.5">Yearly Appreciation: {marketData.propertyGrowthRate.toFixed(1)}%</p>
      </div>
    </div>
  );
}
