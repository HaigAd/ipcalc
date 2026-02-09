import { AustralianState, PropertyDetails } from '../types';

type Bracket = {
  threshold: number;
  base: number;
  rate: number;
};

export const LAND_TAX_RULES_AS_AT = '2026-02-09';

const LAND_TAX_BRACKETS: Record<AustralianState, Bracket[]> = {
  NSW: [
    // Revenue NSW thresholds and rates (updated 25 Sep 2025)
    { threshold: 1075000, base: 100, rate: 0.016 },
    { threshold: 6571000, base: 88036, rate: 0.02 },
  ],
  VIC: [
    // SRO VIC general rates (from 2024 land tax year)
    { threshold: 50000, base: 500, rate: 0 },
    { threshold: 100000, base: 975, rate: 0 },
    { threshold: 300000, base: 1350, rate: 0.003 },
    { threshold: 600000, base: 2250, rate: 0.006 },
    { threshold: 1000000, base: 4650, rate: 0.009 },
    { threshold: 1800000, base: 11850, rate: 0.0165 },
    { threshold: 3000000, base: 31650, rate: 0.0265 },
  ],
  QLD: [
    // QLD Land Tax Act 2010, Schedule 1 (individuals)
    { threshold: 600000, base: 500, rate: 0.01 },
    { threshold: 1000000, base: 4500, rate: 0.0165 },
    { threshold: 3000000, base: 37500, rate: 0.0125 },
    { threshold: 5000000, base: 62500, rate: 0.0175 },
    { threshold: 10000000, base: 150000, rate: 0.0225 },
  ],
  SA: [
    // RevenueSA 2025-26 General Rates
    { threshold: 833000, base: 0, rate: 0.005 },
    { threshold: 1338000, base: 2525, rate: 0.01 },
    { threshold: 1946000, base: 8605, rate: 0.02 },
    { threshold: 3116000, base: 32005, rate: 0.024 },
  ],
  WA: [
    // WA DTF land tax rates (updated 9 Sep 2025)
    { threshold: 300000, base: 300, rate: 0 },
    { threshold: 420000, base: 300, rate: 0.0025 },
    { threshold: 1000000, base: 1750, rate: 0.009 },
    { threshold: 1800000, base: 8950, rate: 0.018 },
    { threshold: 5000000, base: 66550, rate: 0.02 },
    { threshold: 11000000, base: 186550, rate: 0.0267 },
  ],
  TAS: [
    // SRO Tasmania rates from 1 Jul 2025
    { threshold: 125000, base: 50, rate: 0.0045 },
    { threshold: 500000, base: 1737.5, rate: 0.015 },
  ],
  NT: [
    // NT has no general land tax
    { threshold: 0, base: 0, rate: 0 },
  ],
  ACT: [
    // Placeholder generalised curve pending extraction from ACT 2025-26 determination table
    { threshold: 0, base: 0, rate: 0.0054 },
    { threshold: 150000, base: 810, rate: 0.0064 },
    { threshold: 275000, base: 1610, rate: 0.0124 },
    { threshold: 1000000, base: 10600, rate: 0.0125 },
    { threshold: 2000000, base: 23100, rate: 0.0126 },
  ],
};

const calculateByBrackets = (landValue: number, brackets: Bracket[]): number => {
  if (landValue <= 0 || brackets.length === 0) {
    return 0;
  }

  const sortedBrackets = [...brackets].sort((a, b) => a.threshold - b.threshold);
  if (landValue < sortedBrackets[0].threshold) {
    return 0;
  }

  let selected = sortedBrackets[0];
  for (const bracket of sortedBrackets) {
    if (landValue >= bracket.threshold) {
      selected = bracket;
    }
  }

  const taxableAmount = Math.max(0, landValue - selected.threshold);
  return Math.max(0, selected.base + taxableAmount * selected.rate);
};

const coerceNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  return 0;
};

export const calculateStateLandTax = (
  state: AustralianState,
  landValue: number,
  isPPOR: boolean
): number => {
  if (isPPOR || state === 'NT') {
    return 0;
  }

  const brackets = LAND_TAX_BRACKETS[state];
  return Math.round(calculateByBrackets(landValue, brackets));
};

export const calculateEffectiveLandTax = (
  propertyDetails: PropertyDetails,
  state: AustralianState,
  overrides?: {
    landValue?: number;
    otherTaxableLandValue?: number;
  }
): { amount: number; landValueUsed: number } => {
  if (!propertyDetails.includeLandTax) {
    return { amount: 0, landValueUsed: 0 };
  }

  if (propertyDetails.landTaxCalculationMode === 'manual') {
    return {
      amount: Math.max(0, coerceNumber(propertyDetails.manualLandTaxAmount)),
      landValueUsed: Math.max(0, coerceNumber(overrides?.landValue ?? propertyDetails.landValue)),
    };
  }

  const landValue = Math.max(0, coerceNumber(overrides?.landValue ?? propertyDetails.landValue));
  const otherTaxableLandValue = Math.max(
    0,
    coerceNumber(overrides?.otherTaxableLandValue ?? propertyDetails.otherTaxableLandValue)
  );
  if (landValue <= 0) {
    return { amount: 0, landValueUsed: 0 };
  }

  // Estimate this property's attributable land tax as the incremental tax over other holdings.
  const totalHoldingsLandValue = landValue + otherTaxableLandValue;
  const taxOnTotalHoldings = calculateStateLandTax(state, totalHoldingsLandValue, propertyDetails.isPPOR);
  const taxOnOtherHoldings = calculateStateLandTax(state, otherTaxableLandValue, propertyDetails.isPPOR);

  return {
    amount: Math.max(0, taxOnTotalHoldings - taxOnOtherHoldings),
    landValueUsed: landValue,
  };
};
