import { useMemo } from 'react';
import { PurchaseCosts, PropertyDetails, AustralianState } from '../types';
import { calculateStampDuty } from '../calculations/stampDuty';
import { calculateTransferFee } from '../calculations/transferFee';
import { calculateHomeBuyerBenefits } from '../calculations/homeBuyerBenefits';
import { calculateEffectiveLMI } from '../calculations/lmi';

const mortgageRegistrationFee = 224;

export const usePurchaseCosts = (
  propertyDetails: PropertyDetails,
  conveyancingFee: number = 2000,
  buildingAndPestFee: number = 500,
  state: AustralianState = 'NSW'
): PurchaseCosts => {
  return useMemo(() => {
    const isFirstHomeBuyer =
      propertyDetails.isPPOR && propertyDetails.homeBuyerType === 'first-home-buyer';
    const stampDutyBeforeConcessions = calculateStampDuty(
      propertyDetails.purchasePrice,
      false,
      false,
      state
    );
    const stampDuty = calculateStampDuty(
      propertyDetails.purchasePrice,
      propertyDetails.isPPOR,
      isFirstHomeBuyer,
      state
    );
    const benefits = calculateHomeBuyerBenefits({
      state,
      propertyDetails,
      stampDutyBeforeConcessions,
      stampDutyAfterConcessions: stampDuty,
    });

    const transferFee = calculateTransferFee(propertyDetails.purchasePrice, state);
    const lmi = calculateEffectiveLMI(
      propertyDetails.purchasePrice,
      propertyDetails.depositAmount,
      propertyDetails.waiveLMI,
      propertyDetails.lmiCalculationMode,
      propertyDetails.manualLMIAmount
    );

    const total =
      conveyancingFee +
      buildingAndPestFee +
      transferFee +
      lmi +
      stampDuty +
      mortgageRegistrationFee -
      benefits.grantAmount;

    return {
      conveyancingFee,
      buildingAndPestFee,
      transferFee,
      lmi,
      stampDutyBeforeConcessions: benefits.stampDutyBeforeConcessions,
      stampDutyConcession: benefits.stampDutyConcession,
      stampDuty,
      homeBuyerGrant: benefits.grantAmount,
      homeBuyerGrantProgram: benefits.grantProgram,
      homeBuyerGrantBlockedByPrecisionInputs: benefits.grantBlockedByPrecisionInputs,
      netPurchaseCostBenefits: benefits.netBenefit,
      mortgageRegistrationFee,
      total,
      state
    };
  }, [propertyDetails, conveyancingFee, buildingAndPestFee, state]);
};
