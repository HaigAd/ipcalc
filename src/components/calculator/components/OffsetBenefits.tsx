import { CalculationResults } from '../types';

interface OffsetBenefitsProps {
  calculationResults: CalculationResults;
}

export function OffsetBenefits({ calculationResults }: OffsetBenefitsProps) {
  const formatLoanReduction = (years: number, months: number) => {
    if (years === 0 && months === 0) return '0 years';
    if (years === 0) return `${months} months`;
    if (months === 0) return `${years} years`;
    return `${years} years, ${months} months`;
  };

  const formatLargeNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const lastProjection = calculationResults.yearlyProjections[calculationResults.yearlyProjections.length - 1];
  const totalContributions = lastProjection?.cumulativeOffsetContributions || 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Offset Account Benefits</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-600 mb-1">Initial Offset Amount</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-base text-purple-700">$</span>
            <p className="text-xl font-bold text-purple-900">
              {formatLargeNumber(Math.round(calculationResults.offsetAmount))}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-600 mb-1">Total Contributions</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-base text-blue-700">$</span>
            <p className="text-xl font-bold text-blue-900">
              {formatLargeNumber(Math.round(totalContributions))}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
          <p className="text-sm font-medium text-emerald-600 mb-1">Interest Saved</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-base text-emerald-700">$</span>
            <p className="text-xl font-bold text-emerald-900">
              {formatLargeNumber(Math.round(calculationResults.totalInterestSaved))}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4">
          <p className="text-sm font-medium text-teal-600 mb-1">Loan Term Reduction</p>
          <div className="flex items-baseline space-x-1">
            <p className="text-xl font-bold text-teal-900">
              {formatLoanReduction(calculationResults.yearsReducedFromLoan, calculationResults.monthsReducedFromLoan)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-lg p-4 mt-4">
        <div className="space-y-2">
          <p className="text-sm text-slate-600">
            These calculations show the combined benefits of your initial offset balance and regular contributions. 
            When buying a property:
          </p>
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
            <li>Your initial offset amount of ${Math.round(calculationResults.offsetAmount).toLocaleString()} reduces the interest-bearing portion of your loan from day one</li>
            <li>Regular contributions totaling ${Math.round(totalContributions).toLocaleString()} further reduce your interest costs over time</li>
            <li>The combined effect saves ${Math.round(calculationResults.totalInterestSaved).toLocaleString()} in interest and reduces your loan term by {formatLoanReduction(calculationResults.yearsReducedFromLoan, calculationResults.monthsReducedFromLoan)}</li>
          </ul>
          <p className="text-sm text-slate-600 mt-2">
            In the rental scenario, both your initial savings and regular contributions are invested at the opportunity cost rate, 
            helping to build your investment pool over time. This allows for a fair comparison between buying and renting strategies.
          </p>
        </div>
      </div>
    </div>
  );
}
