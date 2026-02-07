import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { PropertyDetails, PurchaseCosts } from '../types';
import { DepositSlider } from './DepositSlider';
import { Switch } from '../../ui/switch';

interface PropertyPriceFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
  purchaseCosts: PurchaseCosts;
  onStateClick?: () => void;
}

export function PropertyPriceForm({ propertyDetails, setPropertyDetails, purchaseCosts, onStateClick }: PropertyPriceFormProps) {
  const handleDepositChange = (value: number[]) => {
    setPropertyDetails({
      ...propertyDetails,
      depositAmount: value[0]
    });
  };

  const calculateValidDepositAmount = (price: number, savings: number, currentDeposit: number) => {
    const minDeposit = Math.max(price * 0.05, 0);
    const availableForDeposit = Math.max(savings - purchaseCosts.total, 0);
    const maxDeposit = Math.min(availableForDeposit, price);
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
          type="number"
          inputMode="decimal"
          value={propertyDetails.purchasePrice}
          className={inputClasses}
          onChange={(e) => {
            const newPrice = Number(e.target.value);
            const newDepositAmount = calculateValidDepositAmount(
              newPrice,
              propertyDetails.availableSavings,
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

      <div className="space-y-2">
        <Label htmlFor="availableSavings" className={labelClasses}>
          Available Savings ($)
        </Label>
        <Input
          id="availableSavings"
          type="number"
          inputMode="decimal"
          value={propertyDetails.availableSavings}
          className={inputClasses}
          onChange={(e) => {
            const newSavings = Number(e.target.value);
            const newDepositAmount = calculateValidDepositAmount(
              propertyDetails.purchasePrice,
              newSavings,
              propertyDetails.depositAmount
            );

            setPropertyDetails({
              ...propertyDetails,
              availableSavings: newSavings,
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
          onStateClick={onStateClick}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isPPOR" className={labelClasses}>
          This is my PPOR
        </Label>
        <Switch
          id="isPPOR"
          checked={propertyDetails.isPPOR}
          onCheckedChange={(checked) =>
            setPropertyDetails({
              ...propertyDetails,
              isPPOR: checked
            })
          }
        />
      </div>
    </div>
  );
}
