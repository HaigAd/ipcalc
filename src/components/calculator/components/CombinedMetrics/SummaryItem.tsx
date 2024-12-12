export interface SummaryItemProps {
  label: string;
  value: string | number;
  variant?: 'success' | 'danger' | 'neutral';
  suffix?: string;
}

const valueClasses = {
  success: 'text-green-600',
  danger: 'text-red-600',
  neutral: 'text-slate-900'
};

export const SummaryItem = ({ 
  label, 
  value, 
  variant = 'neutral', 
  suffix 
}: SummaryItemProps) => {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`font-medium ${valueClasses[variant]}`}>
        {value}{suffix}
      </span>
    </div>
  );
};
