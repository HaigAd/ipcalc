import { MarketData, PropertyDetails, YearlyProjection } from '../types';

const CGT_RATE = 0.245;
const TAX_FREE_YEARS = 6;

export const calculateCGT = (
  marketData: MarketData,
  propertyDetails: PropertyDetails,
  baseProjections: { yearlyProjections: YearlyProjection[] }
) => {
  const { yearlyProjections } = baseProjections;
  const costBase = propertyDetails.purchasePrice;
  let previousPPORValue = costBase; // Start from cost base
  let existingPPORValue = costBase; // Start from cost base

  const updatedProjections = yearlyProjections.map(projection => {
    let yearlyCGT = 0;

    if (!propertyDetails.isPPOR && !propertyDetails.isCGTExempt) {
      previousPPORValue = existingPPORValue;
      existingPPORValue *= (1 + marketData.propertyGrowthRate / 100);
      
      // Calculate yearly gain directly from previous value
      const yearlyGain = existingPPORValue - previousPPORValue;
      
      if (projection.year <= TAX_FREE_YEARS) {
        // All gains are taxable since we're starting from cost base
        yearlyCGT = yearlyGain * CGT_RATE;
      }
    }

    return {
      ...projection,
      existingPPORValue,
      yearlyCGT
    };
  });

  return {
    yearlyProjections: updatedProjections,
    totalCGT: updatedProjections.reduce((sum, proj) => sum + proj.yearlyCGT, 0),
    finalPPORValue: existingPPORValue
  };
};
