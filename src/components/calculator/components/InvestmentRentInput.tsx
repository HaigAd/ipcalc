import { PropertyDetails } from '../types';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface InvestmentRentInputProps {
  propertyDetails: PropertyDetails;
  onInvestmentRentChange: (value: number) => void;
}

export function InvestmentRentInput({
  propertyDetails,
  onInvestmentRentChange,
}: InvestmentRentInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value) || 0;
    onInvestmentRentChange(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="investmentRent">
          {propertyDetails.isPPOR ? 'Weekly Rent Savings' : 'Weekly Rental Income'}
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input
            id="investmentRent"
            type="number"
            value={propertyDetails.investmentRent}
            onChange={handleChange}
            className="pl-7"
            min={0}
            step={10}
          />
        </div>
        <p className="text-sm text-gray-500">
          {propertyDetails.isPPOR
            ? 'Estimate the weekly rent you avoid paying by living here'
            : 'Set the expected weekly rental income for this investment property'}
        </p>
      </div>
    </div>
  );
}
