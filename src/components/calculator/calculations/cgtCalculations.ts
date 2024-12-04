import { MarketData, PropertyDetails, YearlyProjection } from '../types';

const CGT_RATE = 0.245;
const TAX_FREE_YEARS = 6;

export const calculateCGT = (
  marketData: MarketData,
  propertyDetails: PropertyDetails,
  baseProjections: { yearlyProjections: YearlyProjection[] }
) => {
  const { yearlyProjections } = baseProjections;
  let previousPPORValue = propertyDetails.otherPropertyValue;
  let existingPPORValue = propertyDetails.otherPropertyValue;

  const updatedProjections = yearlyProjections.map(projection => {
    let yearlyCGT = 0;

    if (propertyDetails.considerPPORTax) {
      previousPPORValue = existingPPORValue;
      existingPPORValue *= (1 + marketData.propertyGrowthRate / 100);
      const yearlyGain = existingPPORValue - previousPPORValue;
      
      if (projection.year <= TAX_FREE_YEARS) {
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
