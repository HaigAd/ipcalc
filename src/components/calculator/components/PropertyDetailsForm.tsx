import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { PropertyDetails, PurchaseCosts } from '../types';
import { DepositSlider } from './DepositSlider';
import { PropertySwitches } from './PropertySwitches';

interface PropertyDetailsFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
  purchaseCosts: PurchaseCosts;
}

export function PropertyDetailsForm({ propertyDetails, setPropertyDetails, purchaseCosts }: PropertyDetailsFormProps) {
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

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-slate-900">Property Details</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="purchasePrice" className="text-sm font-medium text-slate-700">
              Purchase Price ($)
            </Label>
            <Input
              id="purchasePrice"
              type="number"
              value={propertyDetails.purchasePrice}
              className="h-11 px-4 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
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

          <div className="space-y-3">
            <Label htmlFor="weeklyRent" className="text-sm font-medium text-slate-700">
              Weekly Rent Comparator ($)
            </Label>
            <Input
              id="weeklyRent"
              type="number"
              value={propertyDetails.weeklyRent}
              className="h-11 px-4 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              onChange={(e) => {
                setPropertyDetails({
                  ...propertyDetails,
                  weeklyRent: Number(e.target.value)
                });
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="availableSavings" className="text-sm font-medium text-slate-700">
            Available Savings ($)
          </Label>
          <Input
            id="availableSavings"
            type="number"
            value={propertyDetails.availableSavings}
            className="h-11 px-4 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
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

        <div className="py-2">
          <DepositSlider
            propertyDetails={propertyDetails}
            purchaseCosts={purchaseCosts}
            onDepositChange={handleDepositChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="interestRate" className="text-sm font-medium text-slate-700">
              Interest Rate (%)
            </Label>
            <Input
              id="interestRate"
              type="number"
              step="0.01"
              value={propertyDetails.interestRate}
              className="h-11 px-4 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              onChange={(e) => setPropertyDetails({
                ...propertyDetails,
                interestRate: Number(e.target.value)
              })}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="loanTerm" className="text-sm font-medium text-slate-700">
              Loan Term (years)
            </Label>
            <Input
              id="loanTerm"
              type="number"
              value={propertyDetails.loanTerm}
              className="h-11 px-4 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              onChange={(e) => setPropertyDetails({
                ...propertyDetails,
                loanTerm: Number(e.target.value)
              })}
            />
          </div>
        </div>

        <div className="pt-2">
          <PropertySwitches
            propertyDetails={propertyDetails}
            onPropertyDetailsChange={setPropertyDetails}
          />
        </div>
      </div>
    </div>
  );
}
