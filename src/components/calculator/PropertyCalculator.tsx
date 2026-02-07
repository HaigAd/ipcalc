import { useComponentOrder } from './hooks/useComponentOrder';
import { useCalculatorState } from './hooks/useCalculatorState';
import { PropertyPriceForm } from './components/PropertyPriceForm';
import { LoanDetailsForm } from './components/LoanDetailsForm';
import { YearlyProjectionsTable } from './components/YearlyProjectionsTable';
import { CalculatorTabs } from './components/CalculatorTabs';
import { RenderComponentExtraProps } from './components/Tabs';
import { ComponentId } from './hooks/useComponentOrder';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CombinedMetrics } from './components/CombinedMetrics';
import { TaxImplications } from './components/TaxImplications';
import { ScenariosMenu } from './components/ScenariosMenu/index';
import { AssumptionsSummary } from './components/AssumptionsSummary';
import { ChangeImpactSummary } from './components/ChangeImpactSummary';
import { CalculationResults, MarketData, PropertyDetails } from './types';

interface AssumptionSnapshot {
  isPPOR: boolean;
  loanType: PropertyDetails['loanType'];
  interestRate: number;
  loanTerm: number;
  noNegativeGearing: boolean;
  noNegativeGearingStartYear: number;
  isCGTExempt: boolean;
  propertyGrowthRate: number;
  rentIncreaseRate: number;
  operatingExpensesGrowthRate: number;
  offsetMode: 'manual' | 'auto';
  offsetContributionAmount: number;
  offsetContributionFrequency: PropertyDetails['offsetContribution']['frequency'];
}

interface MetricsSnapshot {
  year1CashFlow: number;
  finalNetPosition: number;
  finalCGT: number;
}

interface ChangeSummary {
  reasons: string[];
  deltas: { label: string; value: number }[];
}

const getAssumptionSnapshot = (
  propertyDetails: PropertyDetails,
  marketData: MarketData
): AssumptionSnapshot => ({
  isPPOR: propertyDetails.isPPOR,
  loanType: propertyDetails.loanType,
  interestRate: propertyDetails.interestRate,
  loanTerm: propertyDetails.loanTerm,
  noNegativeGearing: propertyDetails.noNegativeGearing,
  noNegativeGearingStartYear: propertyDetails.noNegativeGearingStartYear,
  isCGTExempt: propertyDetails.isCGTExempt,
  propertyGrowthRate: marketData.propertyGrowthRate,
  rentIncreaseRate: marketData.rentIncreaseRate,
  operatingExpensesGrowthRate: marketData.operatingExpensesGrowthRate,
  offsetMode: propertyDetails.manualOffsetAmount !== undefined ? 'manual' : 'auto',
  offsetContributionAmount: propertyDetails.offsetContribution.amount,
  offsetContributionFrequency: propertyDetails.offsetContribution.frequency,
});

const getMetricsSnapshot = (calculationResults: CalculationResults): MetricsSnapshot => {
  const year1 = calculationResults.yearlyProjections.find((projection) => projection.year === 1);
  const finalProjection =
    calculationResults.yearlyProjections[calculationResults.yearlyProjections.length - 1];

  return {
    year1CashFlow: year1?.cashFlow ?? 0,
    finalNetPosition: finalProjection?.netPosition ?? 0,
    finalCGT: calculationResults.finalCGTPayable,
  };
};

const getChangeReasons = (previous: AssumptionSnapshot, current: AssumptionSnapshot): string[] => {
  const reasons: string[] = [];

  if (previous.isPPOR !== current.isPPOR) {
    reasons.push(current.isPPOR ? 'Use case switched to PPOR.' : 'Use case switched to investment property.');
  }
  if (previous.loanType !== current.loanType) {
    reasons.push(
      current.loanType === 'interest-only'
        ? 'Loan type changed to Interest-Only.'
        : 'Loan type changed to Principal & Interest.'
    );
  }
  if (previous.noNegativeGearing !== current.noNegativeGearing) {
    reasons.push(
      current.noNegativeGearing
        ? `Loss quarantine enabled from year ${current.noNegativeGearingStartYear}.`
        : 'Loss quarantine disabled.'
    );
  }
  if (
    current.noNegativeGearing &&
    previous.noNegativeGearingStartYear !== current.noNegativeGearingStartYear
  ) {
    reasons.push(`Loss quarantine start year changed to year ${current.noNegativeGearingStartYear}.`);
  }
  if (Math.abs(previous.interestRate - current.interestRate) >= 0.01) {
    reasons.push(`Interest rate changed from ${previous.interestRate.toFixed(2)}% to ${current.interestRate.toFixed(2)}%.`);
  }
  if (previous.loanTerm !== current.loanTerm) {
    reasons.push(`Loan term changed from ${previous.loanTerm} to ${current.loanTerm} years.`);
  }
  if (Math.abs(previous.propertyGrowthRate - current.propertyGrowthRate) >= 0.01) {
    reasons.push(
      `Property growth changed from ${previous.propertyGrowthRate.toFixed(2)}% to ${current.propertyGrowthRate.toFixed(2)}%.`
    );
  }
  if (Math.abs(previous.rentIncreaseRate - current.rentIncreaseRate) >= 0.01) {
    reasons.push(
      `Rent growth changed from ${previous.rentIncreaseRate.toFixed(2)}% to ${current.rentIncreaseRate.toFixed(2)}%.`
    );
  }
  if (
    Math.abs(previous.operatingExpensesGrowthRate - current.operatingExpensesGrowthRate) >= 0.01
  ) {
    reasons.push(
      `Operating expense growth changed from ${previous.operatingExpensesGrowthRate.toFixed(2)}% to ${current.operatingExpensesGrowthRate.toFixed(2)}%.`
    );
  }
  if (previous.offsetMode !== current.offsetMode) {
    reasons.push(`Offset mode changed to ${current.offsetMode === 'manual' ? 'manual' : 'automatic'}.`);
  }
  if (Math.abs(previous.offsetContributionAmount - current.offsetContributionAmount) >= 1) {
    reasons.push(
      `Offset contribution changed from $${Math.round(previous.offsetContributionAmount).toLocaleString()} to $${Math.round(current.offsetContributionAmount).toLocaleString()}.`
    );
  }
  if (previous.offsetContributionFrequency !== current.offsetContributionFrequency) {
    reasons.push(
      `Offset contribution frequency changed from ${previous.offsetContributionFrequency} to ${current.offsetContributionFrequency}.`
    );
  }
  if (previous.isCGTExempt !== current.isCGTExempt) {
    reasons.push(current.isCGTExempt ? 'CGT exemption enabled.' : 'CGT exemption disabled.');
  }

  return reasons.slice(0, 4);
};

export function PropertyCalculator() {
  const {
    propertyDetails,
    setPropertyDetails,
    marketData,
    setMarketData,
    costStructure,
    updateCostStructure,
    setConveyancingFee,
    setBuildingAndPestFee,
    purchaseCosts,
    calculationResults,
    resetToDefaults,
    state,
    setState,
    // Scenarios
    scenarios,
    activeScenarioId,
    activeScenario,
    hasChanges,
    saveScenario,
    updateScenario,
    loadScenario,
    deleteScenario,
    updateScenarioName,
  } = useCalculatorState();
  const previousSnapshotRef = useRef<{ assumptions: AssumptionSnapshot; metrics: MetricsSnapshot } | null>(null);
  const [changeSummary, setChangeSummary] = useState<ChangeSummary | null>(null);

  const { components } = useComponentOrder();

  useEffect(() => {
    const currentAssumptions = getAssumptionSnapshot(propertyDetails, marketData);
    const currentMetrics = getMetricsSnapshot(calculationResults);
    const previousSnapshot = previousSnapshotRef.current;

    if (!previousSnapshot) {
      previousSnapshotRef.current = {
        assumptions: currentAssumptions,
        metrics: currentMetrics,
      };
      return;
    }

    const reasons = getChangeReasons(previousSnapshot.assumptions, currentAssumptions);
    if (reasons.length > 0) {
      setChangeSummary({
        reasons,
        deltas: [
          {
            label: 'Year 1 cash flow change',
            value: currentMetrics.year1CashFlow - previousSnapshot.metrics.year1CashFlow,
          },
          {
            label: 'Final net position change',
            value: currentMetrics.finalNetPosition - previousSnapshot.metrics.finalNetPosition,
          },
          {
            label: 'Final CGT change',
            value: currentMetrics.finalCGT - previousSnapshot.metrics.finalCGT,
          },
        ],
      });
    }

    previousSnapshotRef.current = {
      assumptions: currentAssumptions,
      metrics: currentMetrics,
    };
  }, [propertyDetails, marketData, calculationResults]);

  const renderComponent = useCallback((id: ComponentId, extraProps?: RenderComponentExtraProps) => {
    switch (id) {
      case 'price':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 md:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-900">Property Price & Deposit</h2>
            <PropertyPriceForm
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              purchaseCosts={purchaseCosts}
              onStateClick={extraProps?.onStateClick}
            />
          </div>
        );
      case 'loan':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 md:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-900">Loan Details & Options</h2>
            <LoanDetailsForm
              propertyDetails={propertyDetails}
              setPropertyDetails={setPropertyDetails}
              costStructure={costStructure}
            />
          </div>
        );
      case 'taxImplications':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 md:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-900">Tax Implications</h2>
            <TaxImplications
              propertyDetails={propertyDetails}
              yearlyProjections={calculationResults.yearlyProjections}
              onPropertyDetailsChange={setPropertyDetails}
            />
          </div>
        );
    }
  }, [propertyDetails, setPropertyDetails, costStructure, purchaseCosts, calculationResults]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Property Investment Calculator
          </h1>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <ScenariosMenu
              scenarios={scenarios}
              activeScenarioId={activeScenarioId}
              activeScenario={activeScenario}
              hasChanges={hasChanges}
              onSave={saveScenario}
              onUpdate={updateScenario}
              onLoad={loadScenario}
              onDelete={deleteScenario}
              onRename={updateScenarioName}
            />
            <button
              onClick={resetToDefaults}
              className="inline-flex items-center gap-2 bg-gradient-to-b from-slate-50 to-slate-100 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg shadow-sm hover:from-slate-100 hover:to-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              Reset Calculator
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4 md:p-6 overflow-x-hidden">
          <CalculatorTabs
            propertyDetails={propertyDetails}
            marketData={marketData}
            costStructure={costStructure}
            purchaseCosts={purchaseCosts}
            calculationResults={calculationResults}
            components={components}
            onMarketDataChange={setMarketData}
            onConveyancingFeeChange={setConveyancingFee}
            onBuildingAndPestFeeChange={setBuildingAndPestFee}
            onCostStructureChange={updateCostStructure}
            onStateChange={setState}
            setPropertyDetails={setPropertyDetails}
            renderComponent={renderComponent}
          />

          <AssumptionsSummary
            propertyDetails={propertyDetails}
            marketData={marketData}
            costStructure={costStructure}
            calculationResults={calculationResults}
            state={state}
          />

          {changeSummary && (
            <ChangeImpactSummary
              reasons={changeSummary.reasons}
              deltas={changeSummary.deltas}
            />
          )}

          <div className="mt-4 sm:mt-6 md:mt-8">
            <CombinedMetrics 
              calculationResults={calculationResults}
              propertyDetails={propertyDetails}
            />
          </div>

          <div className="mt-4 sm:mt-6 md:mt-8">
            <YearlyProjectionsTable
              yearlyProjections={calculationResults.yearlyProjections}
              marketData={marketData}
              propertyDetails={propertyDetails}
              costStructure={costStructure}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
