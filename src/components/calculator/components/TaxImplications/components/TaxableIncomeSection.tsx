import { InfoIcon } from 'lucide-react';
import { Input } from '../../../../ui/input';
import { Label } from '../../../../ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../ui/tooltip';
import { cn } from '../../../../../lib/utils';

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
}

interface TaxableIncomeSectionProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  bracket: TaxBracket | undefined;
  taxPayable: number;
}

export function TaxableIncomeSection({
  inputValue,
  onInputChange,
  onBlur,
  onFocus,
  bracket,
  taxPayable,
}: TaxableIncomeSectionProps) {
  return (
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
          onChange={(e) => onInputChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
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
  );
}
