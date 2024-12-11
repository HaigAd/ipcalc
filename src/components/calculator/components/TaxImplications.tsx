import { CalculationResults, PropertyDetails, MarketData } from '../types';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { InfoIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { useState } from 'react';
import { getTaxBracket, calculateTaxPayable } from '../calculations/taxCalculations';

interface TaxImplicationsProps {
  yearlyProjections: CalculationResults['yearlyProjections'];
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
}

export function TaxImplications({ 
  propertyDetails,
  yearlyProjections,
  onPropertyDetailsChange 
}: TaxImplicationsProps) {
  const [inputValue, setInputValue] = useState(propertyDetails.taxableIncome.toString());

  const handleIncomeChange = (value: string) => {
    if (value === '' || /^\d*$/.test(value)) {
      setInputValue(value);
      const income = value === '' ? 0 : parseInt(value, 10);
      onPropertyDetailsChange({
        ...propertyDetails,
        taxableIncome: income
      });
    }
  };

  const handleBlur = () => {
    const income = inputValue === '' ? 0 : parseInt(inputValue, 10);
    setInputValue(income.toLocaleString());
  };

  const handleFocus = () => {
    setInputValue(propertyDetails.taxableIncome.toString());
  };

  const handleCapitalWorksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, '')) || 0;
    onPropertyDetailsChange({
      ...propertyDetails,
      capitalWorksDepreciation: value
    });
  };

  const handlePlantEquipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, '')) || 0;
    onPropertyDetailsChange({
      ...propertyDetails,
      plantEquipmentDepreciation: value
    });
  };

  const bracket = getTaxBracket(propertyDetails.taxableIncome);
  const taxPayable = calculateTaxPayable(propertyDetails.taxableIncome);
  const totalDepreciation = 
    propertyDetails.capitalWorksDepreciation + 
    propertyDetails.plantEquipmentDepreciation;

  // Calculate first year tax benefit
  const firstYearProjection = yearlyProjections[0];
  const taxBenefit = firstYearProjection?.taxBenefit || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Tax Details */}
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="taxableIncome" className="text-sm font-medium">
              Annual Taxable Income
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-4 h-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Your total taxable income from all sources before deductions.
                    This helps calculate your marginal tax rate and potential tax benefits.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium text-slate-900">$</span>
            <Input
              id="taxableIncome"
              type="text"
              value={inputValue}
              onChange={(e) => handleIncomeChange(e.target.value)}
              onBlur={handleBlur}
              onFocus={handleFocus}
              className={cn(
                "h-10 text-lg font-medium text-slate-900",
                "focus-visible:ring-1 focus-visible:ring-slate-300"
              )}
            />
          </div>
          <div className="pt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Tax Bracket</span>
              <span className="font-medium text-slate-900">
                ${bracket?.min.toLocaleString()} - ${bracket?.max === Infinity ? '∞' : bracket?.max.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Marginal Rate</span>
              <span className="font-medium text-slate-900">
                {bracket ? ((bracket.rate * 100).toFixed(1) + '%') : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tax Payable</span>
              <span className="font-medium text-slate-900">
                ${Math.round(taxPayable).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Depreciation Inputs */}
        <div className="rounded-lg border border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Capital Works Depreciation
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-4 h-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Capital works (Division 43) covers the building's structure at 2.5% 
                    of construction cost per year for 40 years.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium text-slate-900">$</span>
            <Input
              type="text"
              value={propertyDetails.capitalWorksDepreciation.toLocaleString()}
              onChange={handleCapitalWorksChange}
              className={cn(
                "h-10 text-lg font-medium text-slate-900",
                "focus-visible:ring-1 focus-visible:ring-slate-300"
              )}
            />
            <span className="text-sm text-slate-500">per year</span>
          </div>
        </div>
      </div>

      {/* Right Column - Plant & Equipment and Summary */}
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Plant & Equipment Depreciation
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-4 h-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Plant and equipment (Division 40) covers removable items like 
                    appliances and carpets, each with their own depreciation rate.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium text-slate-900">$</span>
            <Input
              type="text"
              value={propertyDetails.plantEquipmentDepreciation.toLocaleString()}
              onChange={handlePlantEquipmentChange}
              className={cn(
                "h-10 text-lg font-medium text-slate-900",
                "focus-visible:ring-1 focus-visible:ring-slate-300"
              )}
            />
            <span className="text-sm text-slate-500">per year</span>
          </div>
        </div>

        {/* Tax Benefits Summary */}
        <div className="rounded-lg bg-slate-50 p-4 space-y-4">
          <h3 className="text-sm font-medium text-slate-700">
            Tax Benefits Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Capital Works</span>
              <span className="font-medium text-slate-900">
                ${propertyDetails.capitalWorksDepreciation.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Plant & Equipment</span>
              <span className="font-medium text-slate-900">
                ${propertyDetails.plantEquipmentDepreciation.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Depreciation</span>
                <span className="font-medium text-slate-900">
                  ${totalDepreciation.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">First Year Tax Benefit</span>
              <span className="font-medium text-slate-900">
                ${Math.round(taxBenefit).toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Effective Monthly Benefit</span>
                <span className="font-medium text-slate-900">
                  ${Math.round(taxBenefit / 12).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
