import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../ui/tooltip';

interface TaxBenefitsSummaryProps {
  originalIncome: number;
  firstYearIncomeLoss: number;
  finalTaxableIncome: number;
  capitalWorksValue: number;
  plantEquipmentValue: number;
  totalDepreciation: number;
  taxBenefit: number;
  monthlyBenefit: number;
  firstYearCGT: number;
  isCGTExempt: boolean;
  isPPOR: boolean;
  cgtDiscountPercent: number;
}

export function TaxBenefitsSummary({
  originalIncome,
  firstYearIncomeLoss,
  finalTaxableIncome,
  capitalWorksValue,
  plantEquipmentValue,
  totalDepreciation,
  taxBenefit,
  monthlyBenefit,
  firstYearCGT,
  isCGTExempt,
  isPPOR,
  cgtDiscountPercent,
}: TaxBenefitsSummaryProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 space-y-4">
      <h3 className="text-sm font-medium text-slate-700">
        Tax Benefits Summary
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Original Taxable Income</span>
          <span className="font-medium text-slate-900">
            ${originalIncome.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">First Year Investment Income/Loss</span>
          <span className="font-medium text-slate-900">
            ${Math.round(firstYearIncomeLoss).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Final Taxable Income</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center space-x-1">
                <span className="font-medium text-slate-900">
                  ${Math.round(finalTaxableIncome).toLocaleString()}
                </span>
                <InfoIcon className="w-4 h-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Original taxable income plus property investment income/loss
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="pt-2 border-t border-slate-200">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Capital Works</span>
            <span className="font-medium text-slate-900">
              ${capitalWorksValue.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Plant & Equipment</span>
          <span className="font-medium text-slate-900">
            ${plantEquipmentValue.toLocaleString()}
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
          <span className="text-slate-600">First Year Tax Impact</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center space-x-1">
                <span>Tax Impact</span>
                <InfoIcon className="w-4 h-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Tax impact is calculated as the difference between tax payable on your original income
                  and tax payable on your final taxable income after property deductions.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="font-medium text-slate-900">
            ${Math.round(taxBenefit).toLocaleString()}
          </span>
        </div>
        <div className="pt-2 border-t border-slate-200">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Effective Monthly Benefit</span>
            <span className="font-medium text-slate-900">
              ${Math.round(monthlyBenefit).toLocaleString()}
            </span>
          </div>
        </div>

        {/* CGT Section */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex justify-between text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center space-x-1">
                  <span className="text-slate-600">First Year CGT (if sold)</span>
                  <InfoIcon className="w-4 h-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    {isCGTExempt 
                      ? (isPPOR
                        ? "CGT is fully exempt for your PPOR."
                        : "CGT is exempt for the first 6 years under the main residence exemption rule.")
                      : `Estimated CGT payable if property was sold at the end of the first year. Includes a ${cgtDiscountPercent}% discount for holdings over 12 months.`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="font-medium text-slate-900">
              {isCGTExempt 
                ? "Exempt"
                : `$${Math.round(firstYearCGT).toLocaleString()}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
