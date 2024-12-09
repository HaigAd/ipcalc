import { useRef, useEffect } from 'react';
import { Label } from '../../../ui/label';
import { ToggleGroup, ToggleGroupItem } from '../../../ui/toggle-group';
import { cn } from '../../../../lib/utils';
import { AustralianState } from '../../types';
import { AUSTRALIAN_STATES } from '../../constants/states';
import '../../styles/animations.css';

interface StateSelectorProps {
  value: AustralianState;
  onChange: (state: AustralianState) => void;
  shouldFlash?: boolean;
}

export function StateSelector({
  value,
  onChange,
  shouldFlash = false
}: StateSelectorProps) {
  const toggleGroupRef = useRef<HTMLDivElement>(null);

  // Add flash effect only when shouldFlash is true
  useEffect(() => {
    if (shouldFlash && toggleGroupRef.current) {
      toggleGroupRef.current.classList.add('flash-highlight');
      setTimeout(() => {
        if (toggleGroupRef.current) {
          toggleGroupRef.current.classList.remove('flash-highlight');
        }
      }, 2000);
    }
  }, [shouldFlash]);

  return (
    <div className="space-y-2">
      <Label>State</Label>
      <div ref={toggleGroupRef}>
        <ToggleGroup 
          type="single" 
          value={value}
          onValueChange={(value) => value && onChange(value as AustralianState)}
          className={cn(
            "flex flex-wrap gap-2",
            "transition-all duration-200"
          )}
        >
          {AUSTRALIAN_STATES.map((state) => (
            <ToggleGroupItem
              key={state.id}
              value={state.id}
              aria-label={`Select ${state.label}`}
              className={cn(
                "px-3 py-1",
                "transition-all duration-200",
                "data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900",
                "hover:bg-slate-100"
              )}
            >
              {state.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <p className="text-xs text-gray-500">
        Select state to calculate appropriate stamp duty and other state-specific costs
      </p>
    </div>
  );
}
