import { Switch } from '../../ui/switch';
import { Label } from '../../ui/label';
import { PropertyDetails } from '../types';

interface PropertySwitchesProps {
  propertyDetails: PropertyDetails;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
}

export function PropertySwitches({ propertyDetails, onPropertyDetailsChange }: PropertySwitchesProps) {
  return (
    <div className="space-y-4">
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

      <div className="flex items-center space-x-2">
        <Switch
          id="considerPPORTax"
          checked={propertyDetails.considerPPORTax}
          onCheckedChange={(checked) => onPropertyDetailsChange({
            ...propertyDetails,
            considerPPORTax: checked
          })}
        />
        <div className="space-y-1">
          <Label htmlFor="considerPPORTax">Consider tax implications of PPOR change</Label>
          <p className="text-sm text-gray-500">
            If enabled, calculates CGT implications on existing property (24.5% on gains if buying, no CGT for first 6 years if renting)
          </p>
        </div>
      </div>

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
    </div>
  );
}
