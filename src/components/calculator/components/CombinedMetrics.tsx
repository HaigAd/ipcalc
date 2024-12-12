import { CalculationResults, CostStructure, YearlyProjection } from '../types';
import { OffsetBenefits } from './OffsetBenefits';

interface CombinedMetricsProps {
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

export function CombinedMetrics({ calculationResults, costStructure }: CombinedMetricsProps) {
  const yearlyProjections = calculationResults.yearlyProjections;
  const currentYear = yearlyProjections[0];
  const lastProjection = yearlyProjections[yearlyProjections.length - 1];

  // Calculate monthly values
  const monthlyRental = currentYear.rentalIncome / 12;
  const monthlyExpenses = currentYear.yearlyExpenses / 12;
  const monthlyCashFlow = currentYear.cashFlow / 12;

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-semibold mb-6 text-slate-900">Investment Summary</h2>
      <div className="space-y-8">
        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-sm font-medium text-green-600 mb-1">Monthly Cash Flow</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg text-green-700">$</span>
              <p className={`text-3xl font-bold whitespace-nowrap ${monthlyCashFlow >= 0 ? 'text-green-900' : 'text-red-600'}`}>
                {formatLargeNumber(Math.abs(monthlyCashFlow))}
              </p>
              <span className="text-sm text-green-700">{monthlyCashFlow >= 0 ? 'positive' : 'negative'}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600 mb-1">Average ROI</p>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-blue-900">{calculationResults.averageROI.toFixed(1)}</p>
              <p className="text-lg text-blue-700">%</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-600 mb-1">Monthly Rental Income</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg text-amber-700">$</span>
              <p className="text-3xl font-bold text-amber-900 whitespace-nowrap">
                {formatLargeNumber(monthlyRental)}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Monthly Cost</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg text-slate-700">$</span>
              <p className="text-3xl font-bold text-slate-900 whitespace-nowrap">
                {formatLargeNumber(calculationResults.monthlyMortgagePayment + monthlyExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax and Equity Summary */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Tax & Equity Position</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Annual Depreciation</span>
                  <span className="font-medium text-slate-900">
                    ${formatLargeNumber(currentYear.totalDepreciation)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax Benefit (Year 1)</span>
                  <span className="font-medium text-slate-900">
                    ${formatLargeNumber(currentYear.taxBenefit)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Taxable Income</span>
                  <span className={`font-medium ${currentYear.taxableIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${formatLargeNumber(Math.abs(currentYear.taxableIncome))}
                    <span className="text-xs ml-1">
                      {currentYear.taxableIncome >= 0 ? '(profit)' : '(loss)'}
                    </span>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Current Equity</span>
                  <span className="font-medium text-slate-900">
                    ${formatLargeNumber(currentYear.equity)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Projected Equity (Year {yearlyProjections.length})</span>
                  <span className="font-medium text-slate-900">
                    ${formatLargeNumber(lastProjection.equity)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Total Property Value Growth</span>
                  <span className="font-medium text-green-600">
                    ${formatLargeNumber(lastProjection.propertyValue - currentYear.propertyValue)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Offset Benefits */}
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <OffsetBenefits calculationResults={calculationResults} />
          </div>
        </div>
      </div>
    </div>
  );
}
