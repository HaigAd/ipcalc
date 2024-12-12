import { YearlyProjection } from '../../types';
import { formatLargeNumber } from './utils';
import { SummaryItem } from './SummaryItem';

interface TaxEquitySectionProps {
  currentYear: YearlyProjection;
  lastProjection: YearlyProjection;
  yearlyProjections: YearlyProjection[];
}

export const TaxEquitySection = ({ 
  currentYear, 
  lastProjection, 
  yearlyProjections 
}: TaxEquitySectionProps) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Tax & Equity Position</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <SummaryItem
            label="Annual Depreciation"
            value={`$${formatLargeNumber(currentYear.totalDepreciation)}`}
          />
          <SummaryItem
            label="Tax Benefit (Year 1)"
            value={`$${formatLargeNumber(currentYear.taxBenefit)}`}
          />
          <SummaryItem
            label="Taxable Income"
            value={`$${formatLargeNumber(Math.abs(currentYear.taxableIncome))}`}
            variant={currentYear.taxableIncome >= 0 ? 'success' : 'danger'}
            suffix={currentYear.taxableIncome >= 0 ? ' (profit)' : ' (loss)'}
          />
        </div>
        <div className="space-y-2">
          <SummaryItem
            label="Current Equity"
            value={`$${formatLargeNumber(currentYear.equity)}`}
          />
          <SummaryItem
            label={`Projected Equity (Year ${yearlyProjections.length})`}
            value={`$${formatLargeNumber(lastProjection.equity)}`}
          />
          <SummaryItem
            label="Total Property Value Growth"
            value={`$${formatLargeNumber(lastProjection.propertyValue - currentYear.propertyValue)}`}
            variant="success"
          />
        </div>
      </div>
    </div>
  );
};
