import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Plus, X } from 'lucide-react';
import { MarketData } from '../types';

interface PriceCorrectionsFormProps {
  propertyValueCorrections: MarketData['propertyValueCorrections'];
  onCorrectionsUpdate: (changes: { year: number; change: number }[] | undefined) => void;
}

const PriceCorrectionsForm: React.FC<PriceCorrectionsFormProps> = ({
  propertyValueCorrections,
  onCorrectionsUpdate,
}) => {
  const handleAddChange = () => {
    const newYear = propertyValueCorrections && propertyValueCorrections.length > 0
      ? propertyValueCorrections[propertyValueCorrections.length - 1].year + 1
      : 1;
    const updatedChanges = [
      ...(propertyValueCorrections || []),
      { year: newYear, change: -10 }
    ];
    onCorrectionsUpdate(updatedChanges);
  };

  const handleRemoveChange = (index: number) => {
    const updatedChanges = (propertyValueCorrections || []).filter((_, i) => i !== index);
    onCorrectionsUpdate(updatedChanges.length > 0 ? updatedChanges : undefined);
  };

  const handleYearChange = (index: number, value: number) => {
    const updatedChanges = (propertyValueCorrections || []).map((change, i) =>
      i === index ? { ...change, year: value } : change
    );
    onCorrectionsUpdate(updatedChanges);
  };

  const handleRateChange = (index: number, value: number) => {
    const updatedChanges = (propertyValueCorrections || []).map((change, i) =>
      i === index ? { ...change, change: value } : change
    );
    onCorrectionsUpdate(updatedChanges);
  };

  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";

  return (
    <div className="space-y-4 border-t border-slate-200 pt-4">
      <Button
        onClick={handleAddChange}
        variant="ghost"
        size="sm"
        className="flex items-center gap-2"
        aria-label="Add price correction"
      >
        <Plus className="h-4 w-4" />
        <span className="text-sm">Price correction</span>
      </Button>

      {propertyValueCorrections && propertyValueCorrections.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_auto] gap-4">
          <div>
            <Label className="text-sm font-medium text-slate-700">Year</Label>
            <p className="text-sm text-slate-500">Year of correction</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-slate-700">Change (%)</Label>
            <p className="text-sm text-slate-500">One-time price change</p>
          </div>
          <div></div>
        </div>
      )}

      {propertyValueCorrections?.map((change, index) => (
        <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-4">
          <Input
            id={`price-correction-year-${index}`}
            type="number"
            inputMode="numeric"
            placeholder="Year"
            value={change.year}
            onChange={(e) => handleYearChange(index, Number(e.target.value))}
            min={1}
            className={inputClasses}
            aria-label={`Year ${index + 1} of price correction`}
          />
          <Input
            id={`price-correction-change-${index}`}
            type="number"
            inputMode="decimal"
            placeholder="Change (%)"
            value={change.change}
            onChange={(e) => handleRateChange(index, Number(e.target.value))}
            step="0.1"
            className={inputClasses}
            aria-label={`Price correction for year ${index + 1}`}
          />
          <Button
            onClick={() => handleRemoveChange(index)}
            variant="ghost"
            size="sm"
            className="h-12 sm:h-11 w-12 sm:w-11 p-0"
            aria-label={`Remove price correction for year ${index + 1}`}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PriceCorrectionsForm;
