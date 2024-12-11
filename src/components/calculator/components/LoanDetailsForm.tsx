import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { PropertyDetails } from '../types';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../ui/accordion';
import { OffsetContributionForm } from './OffsetContributionForm';
import { defaultPropertyDetails } from '../config/defaults';
import { Switch } from '../../ui/switch';
import { useState } from 'react';

interface LoanDetailsFormProps {
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
  costStructure: { purchaseCosts: { total: number } };
}

export function LoanDetailsForm({ propertyDetails, setPropertyDetails, costStructure }: LoanDetailsFormProps) {
  const [isManualOffset, setIsManualOffset] = useState(!!propertyDetails.manualOffsetAmount);
  const [manualOffsetValue, setManualOffsetValue] = useState(propertyDetails.manualOffsetAmount?.toString() || '');
  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";
  const labelClasses = "text-sm font-medium text-slate-700 block";

  const totalUpfrontCosts = propertyDetails.depositAmount + costStructure.purchaseCosts.total;
  const calculatedOffset = Math.max(0, propertyDetails.availableSavings - totalUpfrontCosts);

  const formatOffsetSummary = () => {
    const contribution = propertyDetails.offsetContribution || defaultPropertyDetails.offsetContribution;
    const { amount, frequency } = contribution;
    const offsetAmount = propertyDetails.manualOffsetAmount ?? calculatedOffset;
    
    let summary = `$${offsetAmount.toLocaleString()} offset`;
    if (amount && amount > 0) {
      summary += ` + $${amount.toLocaleString()} ${frequency}`;
    }
    return summary;
  };

  const handleOffsetUpdate = (field: keyof PropertyDetails, value: any) => {
    if (field === 'offsetContribution' && !propertyDetails.offsetContribution) {
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

  const handleManualOffsetChange = (value: string) => {
    setManualOffsetValue(value);
    // Always update manualOffsetAmount, even if value is empty
    // This maintains manual mode even when clearing the input
    const numberValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numberValue)) {
      setPropertyDetails({
        ...propertyDetails,
        manualOffsetAmount: numberValue
      });
    }
  };

  const handleOffsetModeChange = (checked: boolean) => {
    setIsManualOffset(checked);
    if (!checked) {
      // When switching back to automatic, remove manual override
      setManualOffsetValue('');
      setPropertyDetails({
        ...propertyDetails,
        manualOffsetAmount: undefined
      });
    } else {
      // When switching to manual, initialize with current calculated offset
      const initialValue = calculatedOffset.toString();
      setManualOffsetValue(initialValue);
      setPropertyDetails({
        ...propertyDetails,
        manualOffsetAmount: calculatedOffset
      });
    }
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
              <span className="text-sm font-medium text-slate-700">Offset Account</span>
              <span className="text-sm text-slate-600">{formatOffsetSummary()}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="manualOffset" className="text-sm font-medium text-slate-700">
                  Manual Offset Amount
                </Label>
                <Switch
                  id="manualOffset"
                  checked={isManualOffset}
                  onCheckedChange={handleOffsetModeChange}
                />
              </div>

              {isManualOffset ? (
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="1000"
                      className="pl-7"
                      value={manualOffsetValue}
                      onChange={(e) => handleManualOffsetChange(e.target.value)}
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    Enter the amount you want to put in the offset account
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    Automatic offset: ${calculatedOffset.toLocaleString()}
                    <br />
                    <span className="text-slate-500">
                      (Available savings minus deposit and purchase costs)
                    </span>
                  </p>
                </div>
              )}

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
