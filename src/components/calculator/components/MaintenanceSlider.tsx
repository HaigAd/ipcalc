import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';
import { CostStructure, PropertyDetails } from '../types';

interface MaintenanceSliderProps {
  costStructure: CostStructure;
  propertyDetails: PropertyDetails;
  onMaintenanceChange: (updates: Partial<CostStructure>) => void;
}

export function MaintenanceSlider({ costStructure, propertyDetails, onMaintenanceChange }: MaintenanceSliderProps) {
  const handleMaintenancePercentageChange = (value: number[]) => {
    const percentage = value[0];
    const cost = (propertyDetails.purchasePrice * percentage) / 100;
    onMaintenanceChange({
      maintenancePercentage: percentage,
      maintenanceCost: cost,
      annualPropertyCosts: costStructure.waterCost + costStructure.ratesCost + cost + costStructure.insuranceCost
    });
  };

  return (
    <div className="space-y-2">
      <Label>Maintenance (% of Purchase Price)</Label>
      <Slider
        value={[costStructure.maintenancePercentage]}
        onValueChange={handleMaintenancePercentageChange}
        min={0}
        max={2}
        step={0.1}
      />
      <div className="text-sm text-gray-500 space-y-1">
        <div>Current: {costStructure.maintenancePercentage.toFixed(1)}%</div>
        <div>Annual Cost: ${costStructure.maintenanceCost.toLocaleString()}</div>
      </div>
    </div>
  );
}
