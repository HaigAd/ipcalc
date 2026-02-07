import { useMemo, useState, useEffect } from 'react';
import { CalculationResults, PropertyDetails } from '../../types';
import { OffsetBenefits } from '../OffsetBenefits';
import { MetricCard } from './MetricCard';
import { TaxEquitySection } from './TaxEquitySection';
import { YearSelector } from './YearSelector';
import { formatNumberWithKMB } from '../../utils/formatters';
interface CombinedMetricsProps {
  calculationResults: CalculationResults;
  propertyDetails: PropertyDetails;
}

export function CombinedMetrics({ calculationResults, propertyDetails }: CombinedMetricsProps) {
  const { yearlyProjections, monthlyMortgagePayment } = calculationResults;
  const [selectedYear, setSelectedYear] = useState(1);
  useEffect(() => {
    if (!yearlyProjections.length) return;
    const hasYearOne = yearlyProjections.some((projection) => projection.year === 1);
    if (hasYearOne && selectedYear === 0) {
      setSelectedYear(1);
    }
  }, [yearlyProjections, selectedYear]);
  const { currentYear, lastProjection, monthlyMetrics } = useMemo(() => {
    const current =
      yearlyProjections.find((projection) => projection.year === selectedYear) ||
      yearlyProjections[0];
    const last = yearlyProjections[yearlyProjections.length - 1];
    const rentalValue = propertyDetails.isPPOR ? current.rentSavings : current.rentalIncome;
    return {
      currentYear: current,
      lastProjection: last,
      monthlyMetrics: {
        rental: rentalValue / 12,
        expenses: current.yearlyExpenses / 12,
        cashFlow: current.cashFlow / 12,
        totalCost: (current.yearlyExpenses - current.taxBenefit - rentalValue) /12
      }
    };
  }, [yearlyProjections, monthlyMortgagePayment, selectedYear, propertyDetails.isPPOR]);

  const years = useMemo(() => {
    return yearlyProjections.map((projection) => projection.year);
  }, [yearlyProjections]);

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">Investment Summary</h2>
        <YearSelector
          years={years}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </div>
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Monthly Cash Flow"
            value={formatNumberWithKMB(Math.abs(monthlyMetrics.cashFlow))}
            prefix="$"
            variant="slate"
            subtext={monthlyMetrics.cashFlow >= 0 ? 'positive' : 'negative'}
          />
          <MetricCard
            label={`Year ${currentYear.year} ROI`}
            value={currentYear.roi.toFixed(1)}
            suffix="%"
            variant="blue"
          />
          <MetricCard
            label={propertyDetails.isPPOR ? "Monthly Rent Savings" : "Monthly Rental Income"}
            value={formatNumberWithKMB(monthlyMetrics.rental)}
            prefix="$"
            variant="amber"
          />
          <MetricCard
            label={`Total Monthly ${monthlyMetrics.totalCost >= 0 ? "Cost" : "Income"}`}
            value={formatNumberWithKMB(Math.abs(monthlyMetrics.totalCost))}
            prefix="$"
            variant = {monthlyMetrics.totalCost >= 0 ? "red" : "green"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaxEquitySection
            currentYear={currentYear}
            lastProjection={lastProjection}
            yearlyProjections={yearlyProjections}
          />
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <OffsetBenefits calculationResults={calculationResults} />
          </div>
        </div>
      </div>
    </div>
  );
}
