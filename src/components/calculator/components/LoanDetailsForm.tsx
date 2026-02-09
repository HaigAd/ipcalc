import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { PropertyDetails, LoanDetails } from '../types/property';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { OffsetContributionForm } from './OffsetContributionForm';
import { defaultPropertyDetails } from '../config/defaults';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import RateChangesForm from './RateChangesForm';

interface LoanDetailsFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
}

export function LoanDetailsForm({ propertyDetails, setPropertyDetails }: LoanDetailsFormProps) {
  const [offsetValue, setOffsetValue] = useState((propertyDetails.manualOffsetAmount ?? 0).toString());
  const [interestRateChanges, setInterestRateChanges] = useState<LoanDetails['interestRateChanges']>(
    propertyDetails.interestRateChanges || []
  );
  const [loanTermInput, setLoanTermInput] = useState(propertyDetails.loanTerm.toString());

  // Keep local state in sync with propertyDetails
  useEffect(() => {
    setInterestRateChanges(propertyDetails.interestRateChanges || []);
  }, [propertyDetails.interestRateChanges]);

  useEffect(() => {
    setLoanTermInput(propertyDetails.loanTerm.toString());
  }, [propertyDetails.loanTerm]);

  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";
  const labelClasses = "text-sm font-medium text-slate-700 block";

  useEffect(() => {
    setOffsetValue((propertyDetails.manualOffsetAmount ?? 0).toString());
  }, [propertyDetails.manualOffsetAmount]);

  const formatOffsetSummary = () => {
    const contribution = propertyDetails.offsetContribution || defaultPropertyDetails.offsetContribution;
    const { amount, frequency } = contribution;
    const offsetAmount = Math.max(0, propertyDetails.manualOffsetAmount ?? 0);
    
    let summary = `$${offsetAmount.toLocaleString()} offset`;
    if (amount && amount > 0) {
      summary += ` + $${amount.toLocaleString()} ${frequency}`;
    }
    return summary;
  };

  const handleOffsetUpdate = (
    field: 'offsetContribution',
    value: PropertyDetails['offsetContribution']
  ) => {
    const mergedValue = !propertyDetails.offsetContribution
      ? {
          ...defaultPropertyDetails.offsetContribution,
          ...value,
        }
      : value;
    setPropertyDetails({
      ...propertyDetails,
      [field]: mergedValue
    });
  };

  const handleRateChangesUpdate = (changes: { year: number; rate: number }[] | undefined) => {
    const updatedChanges = changes || [];
    setInterestRateChanges(updatedChanges);
    setPropertyDetails({
      ...propertyDetails,
      interestRateChanges: updatedChanges.length > 0 ? updatedChanges : undefined
    });
  };

  const handleLoanTermChange = (value: string) => {
    if (value === '' || /^\d*$/.test(value)) {
      setLoanTermInput(value);
      const parsed = Number(value);
      if (Number.isFinite(parsed) && parsed > 0) {
        setPropertyDetails({
          ...propertyDetails,
          loanTerm: parsed
        });
      }
    }
  };

  const handleLoanTermBlur = () => {
    const parsed = Number(loanTermInput);
    const nextValue = Number.isFinite(parsed) && parsed > 0
      ? parsed
      : defaultPropertyDetails.loanTerm;
    setLoanTermInput(nextValue.toString());
    if (nextValue !== propertyDetails.loanTerm) {
      setPropertyDetails({
        ...propertyDetails,
        loanTerm: nextValue
      });
    }
  };

  const handleLoanTermFocus = () => {
    setLoanTermInput(propertyDetails.loanTerm.toString());
  };

  const handleOffsetChange = (value: string) => {
    setOffsetValue(value);
    const numberValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numberValue)) {
      setPropertyDetails({
        ...propertyDetails,
        manualOffsetAmount: Math.max(0, numberValue)
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      <div className="space-y-3">
        <Label className={labelClasses}>Loan Type</Label>
        <RadioGroup
          value={propertyDetails.loanType}
          onValueChange={(value: 'principal-and-interest' | 'interest-only') =>
            setPropertyDetails({
              ...propertyDetails,
              loanType: value
            })
          }
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="principal-and-interest" id="p-and-i" />
            <Label htmlFor="p-and-i" className="text-sm text-slate-600">
              Principal & Interest
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="interest-only" id="interest-only" />
            <Label htmlFor="interest-only" className="text-sm text-slate-600">
              Interest Only
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="interestRate" className={labelClasses}>
            Interest Rate (%)
          </Label>
          <Input
            id="interestRate"
            data-tutorial="interest-rate-input"
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
            value={loanTermInput}
            className={inputClasses}
            onChange={(e) => handleLoanTermChange(e.target.value)}
            onBlur={handleLoanTermBlur}
            onFocus={handleLoanTermFocus}
          />
        </div>
      </div>

      <RateChangesForm 
        initialInterestRate={propertyDetails.interestRate}
        interestRateChanges={interestRateChanges}
        onRateChangesUpdate={handleRateChangesUpdate}
      />
      
      <Accordion type="single" collapsible className="border-t border-slate-200 pt-4">
        <AccordionItem value="offset-contributions" className="border-none">
          <AccordionTrigger className="py-2 hover:no-underline" data-tutorial="offset-account-trigger">
            <div className="flex justify-between w-full">
              <span className="text-sm font-medium text-slate-700">Offset</span>
              <span className="text-sm text-slate-600">{formatOffsetSummary()}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="offsetAmount" className="text-sm font-medium text-slate-700">
                  Offset Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <Input
                    id="offsetAmount"
                    type="number"
                    min="0"
                    step="1000"
                    className="pl-7"
                    value={offsetValue}
                    onChange={(e) => handleOffsetChange(e.target.value)}
                  />
                </div>
                <p className="text-sm text-slate-500">
                  Enter the starting balance for your offset account.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <OffsetContributionForm
                  propertyDetails={{
                    ...propertyDetails,
                    offsetContribution: propertyDetails.offsetContribution || defaultPropertyDetails.offsetContribution
                  }}
                  onUpdate={handleOffsetUpdate}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
