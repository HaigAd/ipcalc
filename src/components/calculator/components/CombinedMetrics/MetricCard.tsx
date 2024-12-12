import { gradientClasses, textClasses, valueClasses } from './utils';

export interface MetricCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  prefix?: string;
  variant: 'green' | 'blue' | 'amber' | 'slate';
  subtext?: string;
  className?: string;
}

export const MetricCard = ({ 
  label, 
  value, 
  suffix, 
  prefix, 
  variant, 
  subtext, 
  className = '' 
}: MetricCardProps) => {
  return (
    <div className={`bg-gradient-to-br ${gradientClasses[variant]} rounded-lg p-4 ${className}`}>
      <p className={`text-sm font-medium ${textClasses[variant]} mb-1`}>{label}</p>
      <div className="flex items-baseline gap-1">
        {prefix && <span className={`text-lg ${textClasses[variant]}`}>{prefix}</span>}
        <p className={`text-3xl font-bold whitespace-nowrap ${valueClasses[variant]}`}>
          {value}
        </p>
        {suffix && <span className={`text-sm ${textClasses[variant]}`}>{suffix}</span>}
        {subtext && <span className={`text-sm ${textClasses[variant]} ml-1`}>({subtext})</span>}
      </div>
    </div>
  );
};
