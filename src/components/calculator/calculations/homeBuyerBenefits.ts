import { AustralianState, PropertyDetails } from '../types';

export interface HomeBuyerBenefits {
  stampDutyBeforeConcessions: number;
  stampDutyConcession: number;
  grantAmount: number;
  netBenefit: number;
  grantProgram: string | null;
  grantBlockedByPrecisionInputs: boolean;
}

interface GrantEstimateInput {
  state: AustralianState;
  price: number;
  isFirstHomeBuyer: boolean;
  isNewHome: boolean;
  grantApplicantAge18OrOver: boolean;
  grantApplicantCitizenOrPR: boolean;
  grantWillOccupyProperty: boolean;
}

const QLD_TEMPORARY_GRANT_END = new Date('2026-06-30T23:59:59');
const TAS_TEMPORARY_GRANT_END = new Date('2026-06-30T23:59:59');

const estimateGrant = ({
  state,
  price,
  isFirstHomeBuyer,
  isNewHome,
  grantApplicantAge18OrOver,
  grantApplicantCitizenOrPR,
  grantWillOccupyProperty,
}: GrantEstimateInput): { amount: number; program: string | null } => {
  if (!isNewHome) {
    return { amount: 0, program: null };
  }

  if (!grantApplicantAge18OrOver || !grantApplicantCitizenOrPR || !grantWillOccupyProperty) {
    return { amount: 0, program: null };
  }

  const now = new Date();

  switch (state) {
    case 'NSW':
      if (isFirstHomeBuyer && price <= 750000) {
        return { amount: 10000, program: 'NSW FHOG' };
      }
      return { amount: 0, program: null };
    case 'VIC':
      if (isFirstHomeBuyer && price <= 750000) {
        return { amount: 10000, program: 'VIC FHOG' };
      }
      return { amount: 0, program: null };
    case 'QLD':
      if (!isFirstHomeBuyer) {
        return { amount: 0, program: null };
      }
      return now <= QLD_TEMPORARY_GRANT_END
        ? { amount: 30000, program: 'QLD FHOG (temporary uplift)' }
        : { amount: 15000, program: 'QLD FHOG' };
    case 'SA':
      return isFirstHomeBuyer ? { amount: 15000, program: 'SA FHOG' } : { amount: 0, program: null };
    case 'WA':
      return isFirstHomeBuyer ? { amount: 10000, program: 'WA FHOG' } : { amount: 0, program: null };
    case 'TAS':
      if (!isFirstHomeBuyer) {
        return { amount: 0, program: null };
      }
      return now <= TAS_TEMPORARY_GRANT_END
        ? { amount: 30000, program: 'TAS FHOG (temporary uplift)' }
        : { amount: 10000, program: 'TAS FHOG' };
    case 'NT':
      if (isFirstHomeBuyer) {
        return { amount: 50000, program: 'NT HomeGrown grant' };
      }
      return { amount: 30000, program: 'NT FreshStart grant' };
    case 'ACT':
      return { amount: 0, program: null };
    default:
      return { amount: 0, program: null };
  }
};

interface BuildBenefitsInput {
  state: AustralianState;
  propertyDetails: PropertyDetails;
  stampDutyBeforeConcessions: number;
  stampDutyAfterConcessions: number;
}

export const calculateHomeBuyerBenefits = ({
  state,
  propertyDetails,
  stampDutyBeforeConcessions,
  stampDutyAfterConcessions,
}: BuildBenefitsInput): HomeBuyerBenefits => {
  const isFirstHomeBuyer = propertyDetails.homeBuyerType === 'first-home-buyer';
  const isNewHome = propertyDetails.propertyPurchaseType === 'new';

  if (!propertyDetails.isPPOR) {
    return {
      stampDutyBeforeConcessions,
      stampDutyConcession: 0,
      grantAmount: 0,
      netBenefit: 0,
      grantProgram: null,
      grantBlockedByPrecisionInputs: false,
    };
  }

  const stampDutyConcession = Math.max(0, stampDutyBeforeConcessions - stampDutyAfterConcessions);
  const { amount: grantAmount, program: grantProgram } = estimateGrant({
    state,
    price: propertyDetails.purchasePrice,
    isFirstHomeBuyer,
    isNewHome,
    grantApplicantAge18OrOver: propertyDetails.grantApplicantAge18OrOver,
    grantApplicantCitizenOrPR: propertyDetails.grantApplicantCitizenOrPR,
    grantWillOccupyProperty: propertyDetails.grantWillOccupyProperty,
  });

  const grantPathwayCouldApply =
    isNewHome &&
    state !== 'ACT' &&
    (isFirstHomeBuyer || state === 'NT');
  const grantBlockedByPrecisionInputs =
    grantPathwayCouldApply &&
    (!propertyDetails.grantApplicantAge18OrOver ||
      !propertyDetails.grantApplicantCitizenOrPR ||
      !propertyDetails.grantWillOccupyProperty);

  return {
    stampDutyBeforeConcessions,
    stampDutyConcession,
    grantAmount,
    netBenefit: stampDutyConcession + grantAmount,
    grantProgram,
    grantBlockedByPrecisionInputs,
  };
};
