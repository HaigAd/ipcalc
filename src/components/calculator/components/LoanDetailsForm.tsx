import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { PropertyDetails } from '../types';
import { PropertySwitches } from './PropertySwitches';

interface LoanDetailsFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
}

export function LoanDetailsForm({ propertyDetails, setPropertyDetails }: LoanDetailsFormProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
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
  );
}
