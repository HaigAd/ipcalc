import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { PropertyDetails } from '../types';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { OffsetContributionForm } from './OffsetContributionForm';
import { defaultPropertyDetails } from '../config/defaults';

interface LoanDetailsFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
}

export function LoanDetailsForm({ propertyDetails, setPropertyDetails }: LoanDetailsFormProps) {
  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";
  const labelClasses = "text-sm font-medium text-slate-700 block";

  const formatOffsetSummary = () => {
    const contribution = propertyDetails.offsetContribution || defaultPropertyDetails.offsetContribution;
    const { amount, frequency } = contribution;
    if (!amount || amount === 0) return "None";
    return `$${amount.toLocaleString()} ${frequency}`;
  };

  const handleOffsetUpdate = (field: keyof PropertyDetails, value: any) => {
    if (field === 'offsetContribution' && !propertyDetails.offsetContribution) {
      // Initialize with defaults if undefined
      value = {
        ...defaultPropertyDetails.offsetContribution,
        ...value
      };
    }
    setPropertyDetails({
      ...propertyDetails,
      [field]: value
    });
  };

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

      <Accordion type="single" collapsible className="border-t border-slate-200 pt-4">
        <AccordionItem value="offset-contributions" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline">
            <div className="flex justify-between w-full">
              <span className="text-sm font-medium text-slate-700">Extra Payments</span>
              <span className="text-sm text-slate-600">{formatOffsetSummary()}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <OffsetContributionForm
                propertyDetails={{
                  ...propertyDetails,
                  offsetContribution: propertyDetails.offsetContribution || defaultPropertyDetails.offsetContribution
                }}
                onUpdate={handleOffsetUpdate}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
