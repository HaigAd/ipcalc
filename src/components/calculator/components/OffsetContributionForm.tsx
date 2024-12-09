import { PropertyDetails } from '../types';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface OffsetContributionFormProps {
  propertyDetails: PropertyDetails;
  onUpdate: (field: keyof PropertyDetails, value: any) => void;
}

export function OffsetContributionForm({ propertyDetails, onUpdate }: OffsetContributionFormProps) {
  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    onUpdate('offsetContribution', {
      ...propertyDetails.offsetContribution,
      amount
    });
  };

  const handleFrequencyChange = (value: string) => {
    if (value === 'weekly' || value === 'monthly' || value === 'yearly') {
      onUpdate('offsetContribution', {
        ...propertyDetails.offsetContribution,
        frequency: value
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Regular Contributions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contributionAmount">Contribution Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <Input
              id="contributionAmount"
              type="number"
              min="0"
              step="100"
              className="pl-7"
              value={propertyDetails.offsetContribution.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contributionFrequency">Frequency</Label>
          <Select
            value={propertyDetails.offsetContribution.frequency}
            onValueChange={handleFrequencyChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mt-4">
        <p className="text-sm text-blue-700">
          Regular contributions will be added to your offset account when buying, reducing the interest paid on your loan. 
          In the rental scenario, these contributions will be added to your investment pool, earning returns at the opportunity cost rate.
        </p>
      </div>
    </div>
  );
}
