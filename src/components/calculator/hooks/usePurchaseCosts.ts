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
    const stampDuty = calculateStampDuty(
      propertyDetails.purchasePrice,
      propertyDetails.isPPOR,
      propertyDetails.isFirstHomeBuyer,
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
