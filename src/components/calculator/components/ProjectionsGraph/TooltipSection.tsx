import { TooltipSectionProps } from './types';
import { formatCurrency } from '../../../../lib/utils';

export function TooltipSection({ title, items }: TooltipSectionProps) {
  return (
    <div className="mb-2">
      <p className="text-xs text-slate-500 font-medium mb-1">{title}</p>
      <div className="space-y-0.5 text-sm">
        {items.map((item, index) => (
          <p key={index}>
            {item.label}:{' '}
            <span className={item.valueClassName || ''}>
              {item.isPercentage ? 
                `${item.value.toFixed(1)}%` : 
                formatCurrency(item.value)}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
