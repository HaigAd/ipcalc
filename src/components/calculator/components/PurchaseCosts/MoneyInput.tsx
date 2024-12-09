import { Input } from '../../../ui/input';
import { Label } from '../../../ui/label';

interface MoneyInputProps {
  id: string;
  label: string;
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function MoneyInput({
  id,
  label,
  value,
  onChange,
  disabled = false,
  className = ''
}: MoneyInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={onChange ? (e) => onChange(Number(e.target.value)) : undefined}
        disabled={disabled}
      />
    </div>
  );
}
