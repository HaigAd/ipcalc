export const calculateLMI = (
  purchasePrice: number,
  depositAmount: number,
  waiveLMI: boolean
): number => {
  if (waiveLMI || purchasePrice <= 0) {
    return 0;
  }

  const safeDeposit = Math.max(0, depositAmount);
  const loanAmount = Math.max(0, purchasePrice - safeDeposit);
  if (loanAmount <= 0) {
    return 0;
  }

  const lvr = loanAmount / purchasePrice;
  if (lvr <= 0.8) {
    return 0;
  }

  let rate = 0;
  if (lvr <= 0.85) {
    rate = 0.006;
  } else if (lvr <= 0.9) {
    rate = 0.012;
  } else if (lvr <= 0.95) {
    rate = 0.024;
  } else {
    rate = 0.038;
  }

  return Math.round(loanAmount * rate);
};

export const calculateEffectiveLMI = (
  purchasePrice: number,
  depositAmount: number,
  waiveLMI: boolean,
  lmiCalculationMode: 'auto' | 'manual',
  manualLMIAmount: number
): number => {
  if (waiveLMI) {
    return 0;
  }

  if (lmiCalculationMode === 'manual') {
    return Math.max(0, Number.isFinite(manualLMIAmount) ? manualLMIAmount : 0);
  }

  return calculateLMI(purchasePrice, depositAmount, false);
};
