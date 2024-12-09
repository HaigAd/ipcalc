import { Label } from '../../../ui/label';
import { Slider } from '../../../ui/slider';

interface ScenarioSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function ScenarioSlider({ label, value, min, max, step, onChange }: ScenarioSliderProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
      />
      <div className="text-sm text-right">
        {value.toFixed(1)}%
      </div>
    </div>
  );
}
