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
import { ChangeImpactSummary } from './components/ChangeImpactSummary';
import { ExportXlsxButton } from './components/ExportXlsxButton';
import { FirstRunTutorialCard } from './components/FirstRunTutorialCard';
import { CalculationResults, MarketData, PropertyDetails } from './types';
import { Button } from '../ui/button';
import { RotateCcw } from 'lucide-react';
import { useFirstRunTutorial } from './hooks/useFirstRunTutorial';

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
  offsetContributionAmount: number;
  offsetContributionFrequency: PropertyDetails['offsetContribution']['frequency'];
  offsetAmount: number;
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
  offsetContributionAmount: propertyDetails.offsetContribution.amount,
  offsetContributionFrequency: propertyDetails.offsetContribution.frequency,
  offsetAmount: propertyDetails.manualOffsetAmount ?? 0,
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
  if (Math.abs(previous.offsetContributionAmount - current.offsetContributionAmount) >= 1) {
    reasons.push(
      `Offset contribution changed from $${Math.round(previous.offsetContributionAmount).toLocaleString()} to $${Math.round(current.offsetContributionAmount).toLocaleString()}.`
    );
  }
  if (Math.abs(previous.offsetAmount - current.offsetAmount) >= 1) {
    reasons.push(
      `Offset amount changed from $${Math.round(previous.offsetAmount).toLocaleString()} to $${Math.round(current.offsetAmount).toLocaleString()}.`
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
  const [activeTab, setActiveTab] = useState('overview');
  const [tabTourCompleted, setTabTourCompleted] = useState(false);
  const [showTutorialCelebration, setShowTutorialCelebration] = useState(false);

  const { components } = useComponentOrder();
  const tutorial = useFirstRunTutorial({
    scenariosCount: scenarios.length,
    hasChanges,
    activeTab,
    tabTourCompleted,
  });

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

  useEffect(() => {
    if (!hasChanges) {
      setChangeSummary(null);
    }
  }, [hasChanges]);

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
              onStateChange={setState}
              onOpenPurchaseCostsDetails={extraProps?.onStateClick}
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
            />
          </div>
        );
      case 'taxImplications':
        return (
          <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 md:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-slate-900">Tax Implications</h2>
            <TaxImplications
              state={state}
              propertyGrowthRate={marketData.propertyGrowthRate}
              propertyDetails={propertyDetails}
              yearlyProjections={calculationResults.yearlyProjections}
              onPropertyDetailsChange={setPropertyDetails}
            />
          </div>
        );
    }
  }, [propertyDetails, setPropertyDetails, purchaseCosts, calculationResults, setState, state]);

  const handleShowNextTutorialTab = useCallback(() => {
    if (!tutorial.nextTabToVisit) return;
    setActiveTab(tutorial.nextTabToVisit);
  }, [tutorial.nextTabToVisit]);

  const handleOpenTutorialGrapher = useCallback(() => {
    setActiveTab('scenario-comparison');
  }, []);

  const handleCompleteTabTour = useCallback(() => {
    setTabTourCompleted(true);
  }, []);

  const handleFinishTutorial = useCallback(() => {
    setShowTutorialCelebration(true);
    tutorial.completeTutorial();
    setTimeout(() => {
      setShowTutorialCelebration(false);
    }, 1800);
  }, [tutorial]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
        <div className="mb-4 sm:mb-6 md:mb-8 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Property Investment Calculator
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Model scenarios, compare outcomes, and export results.
            </p>
          </div>
          <div className="mt-4 border-t border-slate-200 pt-3">
            <div className="-mx-1 overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2 px-1 lg:w-full lg:justify-end">
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
                <ExportXlsxButton
                  propertyDetails={propertyDetails}
                  marketData={marketData}
                  costStructure={costStructure}
                  calculationResults={calculationResults}
                  state={state}
                  scenarioName={activeScenario?.name}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefaults}
                  className="h-9 border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset calculator
                </Button>
              </div>
            </div>
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
            scenarios={scenarios}
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
          />

          {hasChanges && changeSummary && (
            <ChangeImpactSummary
              reasons={changeSummary.reasons}
              deltas={changeSummary.deltas}
            />
          )}

          <div className="mt-4 sm:mt-6 md:mt-8" data-tutorial="investment-overview-section">
            <CombinedMetrics 
              calculationResults={calculationResults}
              propertyDetails={propertyDetails}
            />
          </div>

          <div className="mt-4 sm:mt-6 md:mt-8" data-tutorial="amortization-table-section">
            <YearlyProjectionsTable
              yearlyProjections={calculationResults.yearlyProjections}
              marketData={marketData}
              propertyDetails={propertyDetails}
              costStructure={costStructure}
            />
          </div>
        </div>

        {tutorial.isActive && (
          <FirstRunTutorialCard
            step={tutorial.step}
            activeTab={activeTab}
            nextTabToVisit={tutorial.nextTabToVisit}
            visitedCount={tutorial.visitedCount}
            totalTabs={tutorial.totalTabs}
            onShowNextTab={handleShowNextTutorialTab}
            onOpenGrapher={handleOpenTutorialGrapher}
            onCompleteTabTour={handleCompleteTabTour}
            onFinish={handleFinishTutorial}
            onDismiss={tutorial.completeTutorial}
          />
        )}

        {showTutorialCelebration && (
          <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center">
            <style>
              {`
                @keyframes tutorial-burst {
                  0% { opacity: 0; transform: scale(0.8); }
                  15% { opacity: 1; transform: scale(1); }
                  100% { opacity: 0; transform: scale(1.1); }
                }
                @keyframes tutorial-pop {
                  0% { opacity: 0; transform: translateY(6px) scale(0.96); }
                  20% { opacity: 1; transform: translateY(0) scale(1); }
                  100% { opacity: 0; transform: translateY(-4px) scale(1.02); }
                }
              `}
            </style>
            <div
              className="absolute h-[70vmin] w-[70vmin] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(251,191,36,0.34) 0%, rgba(251,191,36,0.16) 36%, rgba(251,191,36,0) 72%)',
                animation: 'tutorial-burst 1.8s ease-out',
              }}
            />
            <div
              className="rounded-xl border border-amber-200 bg-white/90 px-5 py-3 text-center shadow-lg"
              style={{ animation: 'tutorial-pop 1.8s ease-out' }}
            >
              <p className="text-sm font-semibold text-amber-700">Tutorial Complete</p>
              <p className="text-xs text-slate-600">Nice work. You are ready to model scenarios.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
