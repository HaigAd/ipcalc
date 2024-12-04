import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { PropertyDetails } from '../types';

interface PropertySwitchesProps {
  propertyDetails: PropertyDetails;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
}

export function PropertySwitches({ propertyDetails, onPropertyDetailsChange }: PropertySwitchesProps) {
  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";
  const labelClasses = "text-sm font-medium text-slate-700 block";

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Switch
            id="isPPOR"
            checked={propertyDetails.isPPOR}
            onCheckedChange={(checked) => onPropertyDetailsChange({
              ...propertyDetails,
              isPPOR: checked
            })}
          />
          <Label htmlFor="isPPOR">Principal Place of Residence (PPOR)</Label>
        </div>
        <p className="text-xs text-gray-500">
          If enabled, $7500 discount on stamp duty
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Switch
            id="isFirstHomeBuyer"
            checked={propertyDetails.isFirstHomeBuyer}
            onCheckedChange={(checked) => onPropertyDetailsChange({
              ...propertyDetails,
              isFirstHomeBuyer: checked
            })}
          />
          <Label htmlFor="isFirstHomeBuyer">First Home Buyer</Label>
        </div>
        <p className="text-xs text-gray-500">
          If enabled, no stamp duty if property value is under 800k
        </p>
      </div>

      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <Switch
            id="considerPPORTax"
            checked={propertyDetails.considerPPORTax}
            onCheckedChange={(checked) => onPropertyDetailsChange({
              ...propertyDetails,
              considerPPORTax: checked
            })}
          />
          <Label htmlFor="considerPPORTax">Consider tax implications of PPOR change</Label>
        </div>
        <p className="text-xs text-gray-500">
          If enabled, calculates CGT implications on existing property (24.5% on gains if buying, no CGT for first 6 years if renting)
        </p>
      </div>

      {propertyDetails.considerPPORTax && (
        <div className="space-y-2">
          <Label htmlFor="otherPropertyValue" className={labelClasses}>
            Other Property Value ($)
          </Label>
          <Input
            id="otherPropertyValue"
            type="number"
            inputMode="decimal"
            value={propertyDetails.otherPropertyValue}
            className={inputClasses}
            onChange={(e) => onPropertyDetailsChange({
              ...propertyDetails,
              otherPropertyValue: Number(e.target.value)
            })}
          />
        </div>
      )}
    </div>
  );
}
