import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { CostStructure, YearlyProjection } from '../types';

interface FutureSellingCostsProps {
  costStructure: CostStructure;
  yearlyProjections: YearlyProjection[];
  onSellingCostsChange: (updates: Partial<CostStructure>) => void;
}

export function FutureSellingCosts({ costStructure, yearlyProjections, onSellingCostsChange }: FutureSellingCostsProps) {
  const finalPropertyValue = yearlyProjections.length > 0 
    ? yearlyProjections[yearlyProjections.length - 1].propertyValue 
    : 0;

  const calculatedFutureSellCosts = (finalPropertyValue * costStructure.futureSellCostsPercentage) / 100;

  return (
    <div className="space-y-2">
      <Label htmlFor="futureSellCostsPercentage">Future Selling Costs (%)</Label>
      <Input
        id="futureSellCostsPercentage"
        type="number"
        step="0.1"
        value={costStructure.futureSellCostsPercentage}
        onChange={(e) => onSellingCostsChange({
          futureSellCostsPercentage: Number(e.target.value),
          futureSellCosts: (finalPropertyValue * Number(e.target.value)) / 100
        })}
      />
      <div className="text-sm text-gray-500">
        Final Property Value: ${finalPropertyValue.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500">
        Calculated Selling Costs: ${calculatedFutureSellCosts.toLocaleString()}
      </div>
    </div>
  );
}
