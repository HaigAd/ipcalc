import { CalculationResults, CostStructure } from '../types';
import { OffsetBenefits } from './OffsetBenefits';

interface KeyMetricsProps {
  calculationResults: CalculationResults;
  costStructure?: CostStructure;
}

function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`;
  }
  return Math.round(num).toLocaleString();
}

export function KeyMetrics({ calculationResults, costStructure }: KeyMetricsProps) {
  const monthlyExpenses = costStructure?.annualPropertyCosts ? costStructure.annualPropertyCosts / 12 : 0;
  const lastProjection = calculationResults.yearlyProjections[calculationResults.yearlyProjections.length - 1];
  const totalEquityPaid = lastProjection?.cumulativePrincipalPaid || 0;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-slate-900">Key Metrics</h2>
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4 max-w-3xl">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 min-w-[180px]">
            <p className="text-sm font-medium text-blue-600 mb-1">Break-even Timeline</p>
            <div className="flex items-baseline space-x-1">
              {calculationResults.breakEvenYear === -1 ? (
                <p className="text-3xl font-bold text-red-600">NEVER</p>
              ) : (
                <>
                  <p className="text-3xl font-bold text-blue-900">{calculationResults.breakEvenYear}</p>
                  <p className="text-lg text-blue-700">years</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 min-w-[180px]">
            <p className="text-sm font-medium text-green-600 mb-1">Total Loan Amount</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg text-green-700">$</span>
              <p className="text-3xl font-bold text-green-900 whitespace-nowrap">
                {formatLargeNumber(totalEquityPaid)}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 min-w-[180px]">
            <p className="text-sm font-medium text-slate-600 mb-1">Monthly Mortgage</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg text-slate-700">$</span>
              <p className="text-3xl font-bold text-slate-900 whitespace-nowrap">
                {formatLargeNumber(calculationResults.monthlyMortgagePayment)}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 min-w-[180px]">
            <p className="text-sm font-medium text-amber-600 mb-1">Monthly Expenses</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-lg text-amber-700">$</span>
              <p className="text-3xl font-bold text-amber-900 whitespace-nowrap">
                {formatLargeNumber(monthlyExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <OffsetBenefits calculationResults={calculationResults} />
        </div>
      </div>
    </div>
  );
}
