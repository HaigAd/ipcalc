import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';
import { Input } from '../../ui/input';
import { Pencil } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useState, useRef } from 'react';
import { MarketData } from '../types';

interface OperatingExpensesGrowthSliderProps {
  marketData: MarketData;
  onOperatingExpensesGrowthChange: (value: number) => void;
}

export function OperatingExpensesGrowthSlider({
  marketData,
  onOperatingExpensesGrowthChange
}: OperatingExpensesGrowthSliderProps) {
  const [inputValue, setInputValue] = useState(marketData.operatingExpensesGrowthRate.toLocaleString());
  const [isEditing, setIsEditing] = useState(false);
  const [sliderValue, setSliderValue] = useState(marketData.operatingExpensesGrowthRate);
  const inputRef = useRef<HTMLInputElement>(null);

  // Constants for min/max values
  const MIN_RATE = 0;   // Minimum growth rate
  const MAX_RATE = 10;  // Maximum growth rate

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setInputValue(value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numericValue = Number(inputValue.replace(/,/g, '')) || 0;
    const newValue = Math.min(Math.max(numericValue, MIN_RATE), MAX_RATE);
    setSliderValue(newValue);
    onOperatingExpensesGrowthChange(newValue);
  };

  const handleInputFocus = () => {
    setIsEditing(true);
    setInputValue(sliderValue.toString());
  };

  const handlePencilClick = () => {
    inputRef.current?.focus();
  };

  const handleSliderChange = (value: number[]) => {
    const newValue = Math.min(Math.max(value[0], MIN_RATE), MAX_RATE);
    setSliderValue(newValue);
    setInputValue(newValue.toLocaleString());
  };

  const handleSliderCommit = (value: number[]) => {
    const newValue = Math.min(Math.max(value[0], MIN_RATE), MAX_RATE);
    onOperatingExpensesGrowthChange(newValue);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium text-slate-700">Operating Expenses Growth Rate</Label>
          <button
            onClick={handlePencilClick}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Edit operating expenses growth rate"
          >
            <Pencil className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div className="flex items-baseline space-x-2">
          <div className="flex items-center">
            <Input
              ref={inputRef}
              value={isEditing ? inputValue : sliderValue.toLocaleString()}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              className={cn(
                "w-[80px] text-2xl font-semibold text-slate-900 border-none p-0 h-auto",
                "focus-visible:ring-0 hover:border-b-2 hover:border-slate-200 transition-all",
                isEditing ? "border-b-2 border-slate-300" : ""
              )}
            />
            <span className="text-2xl font-semibold text-slate-900 ml-1">%</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Slider
          value={[sliderValue]}
          min={MIN_RATE}
          max={MAX_RATE}
          step={0.1}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          className="py-4"
        />
        
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <div className="space-y-1">
            <span className="block">Minimum</span>
            <span className="block text-slate-900">{MIN_RATE}%</span>
          </div>
          <div className="space-y-1 text-right">
            <span className="block">Maximum</span>
            <span className="block text-slate-900">{MAX_RATE}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
