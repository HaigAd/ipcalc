import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Label } from '../../../ui/label';
import { MarketData } from '../../types';

interface SensitivityAnalysisProps {
  onGenerate: (parameter: keyof MarketData) => void;
}

export function SensitivityAnalysis({ onGenerate }: SensitivityAnalysisProps) {
  const [selectedParameter, setSelectedParameter] = useState<keyof MarketData>('propertyGrowthRate');

  const parameterLabels: Record<keyof MarketData, string> = {
    propertyGrowthRate: 'Property Growth Rate',
    rentIncreaseRate: 'Rent Increase Rate',
    opportunityCostRate: 'Opportunity Cost Rate'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="parameter" className="text-sm font-medium mb-2">
            Parameter to Analyze
          </Label>
          <select
            id="parameter"
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e.target.value as keyof MarketData)}
            className="w-full h-9 rounded-md border border-slate-200 px-3"
          >
            {Object.entries(parameterLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={() => onGenerate(selectedParameter)} className="h-9">
          Generate Analysis
        </Button>
      </div>
    </div>
  );
}
