import { StateCalculations, StampDutyCalculator } from "./types";

export const calculateActStampDuty: StampDutyCalculator = (
  price: number,
  isPPOR: boolean,
  _isFirstHomeBuyer: boolean
): number => {
  // ACT stamp duty calculation for owner occupiers
  if (isPPOR) {
    if (price <= 260000) {
      return Math.ceil((price / 100) * 0.4);
    }
    if (price <= 300000) {
      return Math.ceil(1040 + ((price - 260000) / 100) * 2.2);
    }
    if (price <= 500000) {
      return Math.ceil(1920 + ((price - 300000) / 100) * 3.4);
    }
    if (price <= 750000) {
      return Math.ceil(8720 + ((price - 500000) / 100) * 4.32);
    }
    if (price <= 1000000) {
      return Math.ceil(19520 + ((price - 750000) / 100) * 5.9);
    }
    if (price <= 1455000) {
      return Math.ceil(34270 + ((price - 1000000) / 100) * 6.4);
    }
    // More than $1,455,000
    return Math.ceil((price / 100) * 4.54);
  }

  // Non-owner occupier rates
  if (price <= 200000) {
    return Math.ceil((price / 100) * 1.2);
  }
  if (price <= 300000) {
    return Math.ceil(2400 + ((price - 200000) / 100) * 2.2);
  }
  if (price <= 500000) {
    return Math.ceil(4600 + ((price - 300000) / 100) * 3.4);
  }
  if (price <= 750000) {
    return Math.ceil(11400 + ((price - 500000) / 100) * 4.32);
  }
  if (price <= 1000000) {
    return Math.ceil(22200 + ((price - 750000) / 100) * 5.9);
  }
  if (price <= 1455000) {
    return Math.ceil(36950 + ((price - 1000000) / 100) * 6.4);
  }
  // More than $1,455,000
  return Math.ceil((price / 100) * 4.54);
};

// Using a basic transfer fee calculation similar to other states
const calculateActTransferFee = (price: number): number => {
  return Math.ceil(price * 0.001); // 0.1% as a placeholder
};

const actCalculations: StateCalculations = {
  stampDuty: calculateActStampDuty,
  transferFee: calculateActTransferFee,
};

export default actCalculations;
