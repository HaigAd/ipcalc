import { useMemo } from 'react';
import { MarketData, YearlyProjection, PropertyDetails } from '../types';

const CGT_RATE = 0.245; // 24.5% CGT rate
const TAX_FREE_YEARS = 6; // Years of CGT exemption if renting

export const useCGTCalculations = (
  marketData: MarketData,
  propertyDetails: PropertyDetails,
  baseProjections: { yearlyProjections: YearlyProjection[] }
) => {
  return useMemo(() => {
    const { yearlyProjections } = baseProjections;
    let previousPPORValue = propertyDetails.otherPropertyValue;
    let existingPPORValue = propertyDetails.otherPropertyValue;

    const updatedProjections = yearlyProjections.map(projection => {
      let yearlyCGT = 0;

      if (propertyDetails.considerPPORTax) {
        // Store previous value before updating
        previousPPORValue = existingPPORValue;
        // Apply the same growth rate to existing PPOR
        existingPPORValue *= (1 + marketData.propertyGrowthRate / 100);
        
        // Calculate gain for this year only. 
        const yearlyGain = existingPPORValue - previousPPORValue;

        //only apply CGT for amounts above the cost base
        if(existingPPORValue > propertyDetails.otherPropertyCostBase && projection.year <= TAX_FREE_YEARS) {
          if(previousPPORValue > propertyDetails.otherPropertyCostBase) { //entire amount above the cost base
            yearlyCGT = yearlyGain * CGT_RATE;
          } else {
            yearlyCGT = (existingPPORValue - propertyDetails.otherPropertyCostBase) * CGT_RATE;
          }
        }
        

      }

      return {
        ...projection,
        existingPPORValue,
        yearlyCGT
      };
    });

    const totalCGT = updatedProjections.reduce((sum, proj) => sum + proj.yearlyCGT, 0);

    return {
      yearlyProjections: updatedProjections,
      totalCGT,
      finalPPORValue: existingPPORValue
    };
  }, [marketData, propertyDetails, baseProjections]);
};
