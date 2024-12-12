export const formatLargeNumber = (num: number): string => {
  try {
    if (!isFinite(num)) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return Math.round(num).toLocaleString();
  } catch (error) {
    console.error('Error formatting number:', error);
    return '0';
  }
};

export const gradientClasses = {
  green: 'from-green-50 to-green-100',
  blue: 'from-blue-50 to-blue-100',
  amber: 'from-amber-50 to-amber-100',
  slate: 'from-slate-50 to-slate-100'
};

export const textClasses = {
  green: 'text-green-600',
  blue: 'text-blue-600',
  amber: 'text-amber-600',
  slate: 'text-slate-600'
};

export const valueClasses = {
  green: 'text-green-900',
  blue: 'text-blue-900',
  amber: 'text-amber-900',
  slate: 'text-slate-900'
};
