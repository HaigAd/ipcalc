import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { AustralianState, PropertyDetails, PurchaseCosts } from '../types';
import { DepositSlider } from './DepositSlider';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { PPORBenefitsPanel } from './PPORBenefitsPanel';

interface PropertyPriceFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
  purchaseCosts: PurchaseCosts;
  onStateChange: (state: AustralianState) => void;
  onOpenPurchaseCostsDetails?: () => void;
}

export function PropertyPriceForm({
  propertyDetails,
  setPropertyDetails,
  purchaseCosts,
  onStateChange,
  onOpenPurchaseCostsDetails,
}: PropertyPriceFormProps) {
  const handleDepositChange = (value: number[]) => {
    setPropertyDetails({
      ...propertyDetails,
      depositAmount: value[0]
    });
  };

  const calculateValidDepositAmount = (price: number, currentDeposit: number) => {
    const minDeposit = Math.max(price * 0.05, 0);
    const maxDeposit = Math.max(price, minDeposit);
    return Math.min(Math.max(currentDeposit, minDeposit), maxDeposit);
  };

  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";
  const labelClasses = "text-base sm:text-sm font-medium text-slate-700 mb-2 block";

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      <div className="space-y-2">
        <Label htmlFor="purchasePrice" className={labelClasses}>
          Purchase Price ($)
        </Label>
        <Input
          id="purchasePrice"
          data-tutorial="purchase-price-input"
          type="number"
          inputMode="decimal"
          value={propertyDetails.purchasePrice}
          className={inputClasses}
          onChange={(e) => {
            const newPrice = Number(e.target.value);
            const newDepositAmount = calculateValidDepositAmount(
              newPrice,
              propertyDetails.depositAmount
            );
            
            setPropertyDetails({
              ...propertyDetails,
              purchasePrice: newPrice,
              depositAmount: newDepositAmount
            });
          }}
        />
      </div>

      <div className="py-2 sm:py-3">
        <DepositSlider
          propertyDetails={propertyDetails}
          purchaseCosts={purchaseCosts}
          onDepositChange={handleDepositChange}
          onOpenPurchaseCostsDetails={onOpenPurchaseCostsDetails}
        />
      </div>

      <div className="space-y-2">
        <Label className={labelClasses}>Property State</Label>
        <Select value={purchaseCosts.state} onValueChange={(value) => onStateChange(value as AustralianState)}>
          <SelectTrigger
            data-tutorial="state-select-trigger"
            className="h-12 sm:h-11 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NSW">NSW</SelectItem>
            <SelectItem value="VIC">VIC</SelectItem>
            <SelectItem value="QLD">QLD</SelectItem>
            <SelectItem value="SA">SA</SelectItem>
            <SelectItem value="WA">WA</SelectItem>
            <SelectItem value="TAS">TAS</SelectItem>
            <SelectItem value="NT">NT</SelectItem>
            <SelectItem value="ACT">ACT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isPPOR" className={labelClasses}>
          This is my PPOR
        </Label>
        <Switch
          id="isPPOR"
          data-tutorial="ppor-switch"
          checked={propertyDetails.isPPOR}
          onCheckedChange={(checked) =>
            setPropertyDetails({
              ...propertyDetails,
              isPPOR: checked
            })
          }
        />
      </div>

      {propertyDetails.isPPOR && (
        <PPORBenefitsPanel
          state={purchaseCosts.state}
          propertyDetails={propertyDetails}
          purchaseCosts={purchaseCosts}
          onPropertyDetailsChange={setPropertyDetails}
        />
      )}
    </div>
  );
}
