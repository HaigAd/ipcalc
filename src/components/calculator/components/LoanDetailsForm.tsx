import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { PropertyDetails } from '../types';
import { PropertySwitches } from './PropertySwitches';

interface LoanDetailsFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
}

export function LoanDetailsForm({ propertyDetails, setPropertyDetails }: LoanDetailsFormProps) {
  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";
  const labelClasses = "text-sm font-medium text-slate-700 block";

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="interestRate" className={labelClasses}>
            Interest Rate (%)
          </Label>
          <Input
            id="interestRate"
            type="number"
            inputMode="decimal"
            step="0.01"
            value={propertyDetails.interestRate}
            className={inputClasses}
            onChange={(e) => setPropertyDetails({
              ...propertyDetails,
              interestRate: Number(e.target.value)
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loanTerm" className={labelClasses}>
            Loan Term (years)
          </Label>
          <Input
            id="loanTerm"
            type="number"
            inputMode="decimal"
            value={propertyDetails.loanTerm}
            className={inputClasses}
            onChange={(e) => setPropertyDetails({
              ...propertyDetails,
              loanTerm: Number(e.target.value)
            })}
          />
        </div>
      </div>

      <div className="pt-1 sm:pt-2">
        <PropertySwitches
          propertyDetails={propertyDetails}
          onPropertyDetailsChange={setPropertyDetails}
        />
      </div>
    </div>
  );
}
