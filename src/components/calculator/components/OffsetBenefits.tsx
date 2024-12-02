import { CalculationResults } from '../types';

interface OffsetBenefitsProps {
  calculationResults: CalculationResults;
}

export function OffsetBenefits({ calculationResults }: OffsetBenefitsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Offset Account Benefits</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-600 mb-1">Available for Offset</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-base text-purple-700">$</span>
            <p className="text-xl font-bold text-purple-900 truncate">
              {Math.round(calculationResults.offsetAmount).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
          <p className="text-sm font-medium text-emerald-600 mb-1">Interest Saved</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-base text-emerald-700">$</span>
            <p className="text-xl font-bold text-emerald-900 truncate">
              {Math.round(calculationResults.totalInterestSaved).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
          <p className="text-sm font-medium text-teal-600 mb-1">Loan Term Reduction</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-xl font-bold text-teal-900">
              {calculationResults.yearsReducedFromLoan}
            </p>
            <p className="text-base text-teal-700">years</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mt-4">
        <p className="text-sm text-slate-600">
          These calculations show the potential benefits of using your available savings in an offset account. 
          The interest saved and loan term reduction are based on maintaining the offset balance over the loan term.
        </p>
      </div>
    </div>
  );
}
