import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';
import { PropertyDetails } from '../types';
import { useMemo, useState, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { Input } from '../../ui/input';
import { Pencil } from 'lucide-react';
import { Switch } from '../../ui/switch';

interface ManagementFeeSliderProps {
  propertyDetails: PropertyDetails;
  onManagementFeeChange: (value: { type: 'percentage' | 'fixed'; value: number }) => void;
}

export function ManagementFeeSlider({ 
  propertyDetails, 
  onManagementFeeChange 
}: ManagementFeeSliderProps) {
  const [inputValue, setInputValue] = useState(propertyDetails.managementFee.value.toLocaleString());
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPercentage = propertyDetails.managementFee.type === 'percentage';

  // Constants for min/max values
  const MIN_PERCENTAGE = 4;  // Typical minimum management fee percentage
  const MAX_PERCENTAGE = 12; // Typical maximum management fee percentage
  const MIN_FIXED = 1000;    // Minimum annual fixed fee
  const MAX_FIXED = 10000;   // Maximum annual fixed fee

  const annualRentalIncome = useMemo(() => {
    return propertyDetails.investmentRent * 52;
  }, [propertyDetails.investmentRent]);

  const annualFeeAmount = useMemo(() => {
    if (isPercentage) {
      return (annualRentalIncome * propertyDetails.managementFee.value) / 100;
    }
    return propertyDetails.managementFee.value;
  }, [propertyDetails.managementFee, annualRentalIncome, isPercentage]);

  const handleTypeToggle = (checked: boolean) => {
    const newType = checked ? 'percentage' : 'fixed';
    // Convert the current value to equivalent in new type
    let newValue: number;
    if (newType === 'percentage') {
      newValue = Math.min(Math.max((propertyDetails.managementFee.value / annualRentalIncome) * 100, MIN_PERCENTAGE), MAX_PERCENTAGE);
    } else {
      newValue = Math.min(Math.max((propertyDetails.managementFee.value / 100) * annualRentalIncome, MIN_FIXED), MAX_FIXED);
    }
    onManagementFeeChange({ type: newType, value: newValue });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setInputValue(value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const numericValue = Number(inputValue.replace(/,/g, '')) || 0;
    const min = isPercentage ? MIN_PERCENTAGE : MIN_FIXED;
    const max = isPercentage ? MAX_PERCENTAGE : MAX_FIXED;
    const newValue = Math.min(Math.max(numericValue, min), max);
    onManagementFeeChange({ 
      type: propertyDetails.managementFee.type, 
      value: newValue 
    });
  };

  const handleInputFocus = () => {
    setIsEditing(true);
    setInputValue(propertyDetails.managementFee.value.toString());
  };

  const handlePencilClick = () => {
    inputRef.current?.focus();
  };

  const handleSliderChange = (value: number[]) => {
    const min = isPercentage ? MIN_PERCENTAGE : MIN_FIXED;
    const max = isPercentage ? MAX_PERCENTAGE : MAX_FIXED;
    const newValue = Math.min(Math.max(value[0], min), max);
    onManagementFeeChange({ 
      type: propertyDetails.managementFee.type, 
      value: newValue 
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium text-slate-700">Management Fee</Label>
            <button
              onClick={handlePencilClick}
              className="p-1 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Edit management fee"
            >
              <Pencil className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Label className="text-sm text-slate-500">Fixed</Label>
            <Switch
              checked={isPercentage}
              onCheckedChange={handleTypeToggle}
            />
            <Label className="text-sm text-slate-500">Percentage</Label>
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <div className="flex items-center">
            {isPercentage ? (
              <>
                <Input
                  ref={inputRef}
                  value={isEditing ? inputValue : Number(inputValue.replace(/,/g, '')).toLocaleString()}
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
              </>
            ) : (
              <>
                <span className="text-2xl font-semibold text-slate-900 mr-1">$</span>
                <Input
                  ref={inputRef}
                  value={isEditing ? inputValue : Number(inputValue.replace(/,/g, '')).toLocaleString()}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onFocus={handleInputFocus}
                  className={cn(
                    "w-[140px] text-2xl font-semibold text-slate-900 border-none p-0 h-auto",
                    "focus-visible:ring-0 hover:border-b-2 hover:border-slate-200 transition-all",
                    isEditing ? "border-b-2 border-slate-300" : ""
                  )}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Slider
          value={[propertyDetails.managementFee.value]}
          min={isPercentage ? MIN_PERCENTAGE : MIN_FIXED}
          max={isPercentage ? MAX_PERCENTAGE : MAX_FIXED}
          step={isPercentage ? 0.1 : 100}
          onValueChange={handleSliderChange}
          className="py-4"
        />
        
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <div className="space-y-1">
            <span className="block">Minimum</span>
            <span className="block text-slate-900">
              {isPercentage ? `${MIN_PERCENTAGE}%` : `$${MIN_FIXED.toLocaleString()}`}
            </span>
          </div>
          <div className="space-y-1 text-right">
            <span className="block">Maximum</span>
            <span className="block text-slate-900">
              {isPercentage ? `${MAX_PERCENTAGE}%` : `$${MAX_FIXED.toLocaleString()}`}
            </span>
          </div>
        </div>

        <div className="space-y-3 rounded-lg bg-slate-50 p-4">
          <h3 className="text-sm font-medium text-slate-700">Annual Cost Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Annual Rental Income</span>
              <span className="font-medium text-slate-900">${annualRentalIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Management Fee</span>
              <span className="font-medium text-slate-900">${annualFeeAmount.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Percentage of Income</span>
                <span className="font-medium text-slate-900">
                  {((annualFeeAmount / annualRentalIncome) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
