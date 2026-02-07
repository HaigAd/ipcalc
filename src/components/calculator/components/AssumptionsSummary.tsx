import { CalculationResults, CostStructure, MarketData, PropertyDetails, AustralianState } from '../types';

interface AssumptionsSummaryProps {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  costStructure: CostStructure;
  calculationResults: CalculationResults;
  state: AustralianState;
}

const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString()}`;
const formatPercent = (value: number) => `${value.toFixed(2)}%`;

const chipClassName =
  'inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700';

export function AssumptionsSummary({
  propertyDetails,
  marketData,
  costStructure,
  calculationResults,
  state,
}: AssumptionsSummaryProps) {
  const offsetMode = propertyDetails.manualOffsetAmount !== undefined ? 'Manual' : 'Auto';
  const offsetAmount = calculationResults.offsetAmount;
  const interestRateChangeCount = propertyDetails.interestRateChanges?.length || 0;
  const managementFeeLabel =
    propertyDetails.managementFee.type === 'percentage'
      ? formatPercent(propertyDetails.managementFee.value)
      : formatCurrency(propertyDetails.managementFee.value);
  const cgtDiscountPercent = (propertyDetails.cgtDiscountRate * 100).toFixed(1);

  return (
    <div className="mt-4 sm:mt-6 md:mt-8 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Assumptions Summary</h2>
        <span className="text-xs text-slate-500">Model inputs currently driving results</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800">Loan & Offset</h3>
          <div className="flex flex-wrap gap-2">
            <span className={chipClassName}>Loan type: {propertyDetails.loanType === 'interest-only' ? 'Interest-Only' : 'Principal & Interest'}</span>
            <span className={chipClassName}>Interest rate: {formatPercent(propertyDetails.interestRate)}</span>
            <span className={chipClassName}>Loan term: {propertyDetails.loanTerm} years</span>
            <span className={chipClassName}>Rate change schedule: {interestRateChangeCount} entries</span>
            <span className={chipClassName}>Offset mode: {offsetMode}</span>
            <span className={chipClassName}>Offset amount: {formatCurrency(offsetAmount)}</span>
            <span className={chipClassName}>
              Offset contribution: {formatCurrency(propertyDetails.offsetContribution.amount)} / {propertyDetails.offsetContribution.frequency}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800">Market & Costs</h3>
          <div className="flex flex-wrap gap-2">
            <span className={chipClassName}>State: {state}</span>
            <span className={chipClassName}>Property growth: {formatPercent(marketData.propertyGrowthRate)}</span>
            <span className={chipClassName}>Rent growth: {formatPercent(marketData.rentIncreaseRate)}</span>
            <span className={chipClassName}>Operating expense growth: {formatPercent(marketData.operatingExpensesGrowthRate)}</span>
            <span className={chipClassName}>Maintenance: {formatPercent(costStructure.maintenancePercentage)}</span>
            <span className={chipClassName}>Management fee: {managementFeeLabel}</span>
            <span className={chipClassName}>Future sell costs: {formatPercent(costStructure.futureSellCostsPercentage)}</span>
          </div>
        </div>

        <div className="space-y-2 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-800">Tax & Policy</h3>
          <div className="flex flex-wrap gap-2">
            <span className={chipClassName}>Use case: {propertyDetails.isPPOR ? 'PPOR' : 'Investment'}</span>
            <span className={chipClassName}>Taxable income baseline: {formatCurrency(propertyDetails.taxableIncome)}</span>
            <span className={chipClassName}>CGT exemption: {propertyDetails.isCGTExempt || propertyDetails.isPPOR ? 'On' : 'Off'}</span>
            <span className={chipClassName}>Custom CGT discount: {propertyDetails.useCustomCGTDiscount ? `${cgtDiscountPercent}%` : 'Standard 50%'}</span>
            <span className={chipClassName}>
              Loss quarantine: {propertyDetails.noNegativeGearing ? `On (from year ${propertyDetails.noNegativeGearingStartYear})` : 'Off'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
