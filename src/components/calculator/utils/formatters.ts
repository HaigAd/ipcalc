export const formatNumberWithKMB = (num: number, forceM: boolean = false): string => {
  if (Math.abs(num) >= 1000000 || forceM) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (Math.abs(num) >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(2);
};
