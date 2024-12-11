import { useMemo } from 'react';
import { PurchaseCosts, PropertyDetails, AustralianState } from '../types';
import { calculateStampDuty } from '../calculations/stampDuty';
import { calculateTransferFee } from '../calculations/transferFee';

const mortgageRegistrationFee = 224;

export const usePurchaseCosts = (
  propertyDetails: PropertyDetails,
  conveyancingFee: number = 2000,
  buildingAndPestFee: number = 500,
  state: AustralianState = 'NSW'
): PurchaseCosts => {
  return useMemo(() => {
    // Always pass false for isPPOR and isFirstHomeBuyer since this is an investment property calculator
    const stampDuty = calculateStampDuty(
      propertyDetails.purchasePrice,
      false, // isPPOR
      false, // isFirstHomeBuyer
      state
    );

    const transferFee = calculateTransferFee(propertyDetails.purchasePrice, state);

    const total = conveyancingFee + buildingAndPestFee + transferFee + stampDuty + mortgageRegistrationFee;

    return {
      conveyancingFee,
      buildingAndPestFee,
      transferFee,
      stampDuty,
      mortgageRegistrationFee,
      total,
      state
    };
  }, [propertyDetails, conveyancingFee, buildingAndPestFee, state]);
};
