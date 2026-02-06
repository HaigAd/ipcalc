import React from 'react';
import { LoanDetails } from '../types/property';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Plus, X } from "lucide-react";

interface RateChangesFormProps {
  initialInterestRate: number;
  interestRateChanges: LoanDetails['interestRateChanges'];
  onRateChangesUpdate: (changes: { year: number; rate: number }[] | undefined) => void;
}

const RateChangesForm: React.FC<RateChangesFormProps> = ({ 
  initialInterestRate, 
  interestRateChanges, 
  onRateChangesUpdate 
}) => {
  const handleAddChange = () => {
    const newYear = interestRateChanges && interestRateChanges.length > 0 
      ? interestRateChanges[interestRateChanges.length - 1].year + 1 
      : 1;
    const newRate = interestRateChanges && interestRateChanges.length > 0 
      ? interestRateChanges[interestRateChanges.length - 1].rate 
      : initialInterestRate;
    
    const updatedChanges = [
      ...(interestRateChanges || []), 
      { year: newYear, rate: newRate }
    ];
    onRateChangesUpdate(updatedChanges);
  };

  const handleRemoveChange = (index: number) => {
    const updatedChanges = (interestRateChanges || []).filter((_, i) => i !== index);
    onRateChangesUpdate(updatedChanges.length > 0 ? updatedChanges : undefined);
  };

  const handleYearChange = (index: number, value: number) => {
    const updatedChanges = (interestRateChanges || []).map((change, i) =>
      i === index ? { ...change, year: value } : change
    );
    onRateChangesUpdate(updatedChanges);
  };

  const handleRateChange = (index: number, value: number) => {
    const updatedChanges = (interestRateChanges || []).map((change, i) =>
      i === index ? { ...change, rate: value } : change
    );
    onRateChangesUpdate(updatedChanges);
  };

  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";

  return (
    <div className="space-y-4 border-t border-slate-200 pt-4">
      <Button
        onClick={handleAddChange}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        aria-label="Add interest rate forecast"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm">Interest rate forecast</span>
      </Button>
      
      {interestRateChanges && interestRateChanges.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Year</Label>
            <p className="text-sm text-slate-500">Year of rate change</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Rate (%)</Label>
            <p className="text-sm text-slate-500">New interest rate</p>
          </div>
          <div></div>
        </div>
      )}
      
      {interestRateChanges?.map((change, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-4">
          <Input
            id={`rate-change-year-${index}`}
            type="number"
            inputMode="numeric"
            placeholder="Year"
            value={change.year}
            onChange={(e) => handleYearChange(index, Number(e.target.value))}
            min={1}
            className={inputClasses}
            aria-label={`Year ${index + 1} of rate change`}
          />
          <Input
            id={`rate-change-rate-${index}`}
            type="number"
            inputMode="decimal"
            placeholder="Interest Rate"
            value={change.rate}
            onChange={(e) => handleRateChange(index, Number(e.target.value))}
            min={0}
            step="0.01"
            className={inputClasses}
            aria-label={`Interest rate for year ${index + 1}`}
          />
          <Button
            onClick={() => handleRemoveChange(index)}
            variant="ghost"
            size="sm"
            className="h-12 sm:h-11 w-12 sm:w-11 p-0"
            aria-label={`Remove rate change for year ${index + 1}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default RateChangesForm;
