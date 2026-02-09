import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../ui/button';
import { TutorialStep } from '../hooks/useFirstRunTutorial';

const TAB_LABELS: Record<string, string> = {
  overview: 'Investment Overview',
  income: 'Income & Expenses',
  market: 'Market Predictions',
  tax: 'Tax & Depreciation',
  purchase: 'Purchase Costs',
};

const SECTION_ORDER = ['overview', 'income', 'market', 'tax', 'purchase', 'grapher'] as const;
type TutorialSection = (typeof SECTION_ORDER)[number];
const SECTION_LABELS: Record<TutorialSection, string> = {
  overview: 'Overview',
  income: 'Income',
  market: 'Market',
  tax: 'Tax',
  purchase: 'Purchase',
  grapher: 'Grapher',
};

const GRAPHER_STEPS: Omit<CoachmarkContent, 'showAdvanceButton'>[] = [
  {
    title: '8. Open Scenario Comparison',
    description: 'Open Scenario Comparison to start the visual walkthrough.',
    targetSelectors: ['[data-tutorial="scenario-comparison-tab"]'],
  },
  {
    title: '8. Choose scenarios to plot',
    description: 'Select which scenarios appear on the chart and use filter/search to find them quickly.',
    targetSelectors: ['[data-tutorial="scenario-grapher-scenarios"]'],
  },
  {
    title: '8. Manage portfolios',
    description: 'Use portfolios to group scenarios into combined lines for a higher-level view.',
    targetSelectors: ['[data-tutorial="scenario-grapher-portfolios"]'],
  },
  {
    title: '8. Adjust graph options',
    description: 'Use graph options to include invested funds and control PPOR rent-savings display.',
    targetSelectors: ['[data-tutorial="scenario-grapher-options"]'],
  },
  {
    title: '8. Read the grapher',
    description: 'Hover lines to compare year-by-year net position and use the legend/selection to focus on key scenarios.',
    targetSelectors: ['[data-tutorial="scenario-grapher"]'],
  },
];

type CoachmarkContent = {
  title: string;
  description: string;
  targetSelectors: string[];
  showAdvanceButton: boolean;
  advanceLabel?: string;
};

interface FirstRunTutorialCardProps {
  step: TutorialStep;
  activeTab: string;
  nextTabToVisit: string | null;
  visitedCount: number;
  totalTabs: number;
  onShowNextTab: () => void;
  onOpenGrapher: () => void;
  onCompleteTabTour: () => void;
  onFinish: () => void;
  onDismiss: () => void;
}

const isElementVisible = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  return true;
};

const findVisibleTarget = (selectors: string[]): HTMLElement | null => {
  for (const selector of selectors) {
    const matches = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    const visibleMatch = matches.find(isElementVisible);
    if (visibleMatch) return visibleMatch;
  }
  return null;
};

const TAB_FIELD_STEPS: Partial<Record<string, Omit<CoachmarkContent, 'showAdvanceButton'>[]>> = {
  overview: [
  {
    title: '2. Set purchase price',
    description: 'Enter the property purchase price you are evaluating.',
    targetSelectors: ['[data-tutorial="purchase-price-input"]'],
  },
  {
    title: '2. Set deposit amount',
    description: 'Set your deposit amount for this scenario and borrowing strategy.',
    targetSelectors: ['[data-tutorial="deposit-amount-input"]'],
  },
  {
    title: '2. Confirm state',
    description: 'Select the property state from the dropdown to apply the correct stamp duty and transfer fees.',
    targetSelectors: ['[data-tutorial="state-select-trigger"]'],
  },
  {
    title: '2. Set property use (PPOR)',
    description: 'Toggle whether this is your PPOR. This materially changes tax treatment and scenario outcomes.',
    targetSelectors: ['[data-tutorial="ppor-switch"]'],
  },
  {
    title: '2. Set interest rate',
    description: 'Enter your current loan interest rate, then use Rate Changes to forecast future interest-rate moves by year.',
    targetSelectors: ['[data-tutorial="interest-rate-input"]'],
  },
  {
    title: '2. Review offset account',
    description: 'Open Offset to set your starting offset balance and ongoing offset contributions.',
    targetSelectors: ['[data-tutorial="offset-account-trigger"]'],
  },
  ],
  income: [
    {
      title: '3. Set rental income',
      description:
        'Set weekly rental income (or weekly rent savings for PPOR) to drive yearly cash flow.',
      targetSelectors: ['[data-tutorial="investment-rent-input"]'],
    },
    {
      title: '3. Set recurring property costs',
      description:
        'Enter annual water, rates, and insurance costs to model holding expenses more realistically.',
      targetSelectors: [
        '[data-tutorial="water-cost-input"]',
        '[data-tutorial="rates-cost-input"]',
        '[data-tutorial="insurance-cost-input"]',
      ],
    },
  ],
  market: [
    {
      title: '4. Set growth assumptions',
      description:
        'Tune property growth and rent growth assumptions to reflect your expected market conditions.',
      targetSelectors: ['[data-tutorial="property-growth-slider"]', '[data-tutorial="rent-growth-slider"]'],
    },
    {
      title: '4. Add optional current valuation anchor',
      description:
        'If you already own the property, set current year and current value to anchor projections to today.',
      targetSelectors: ['[data-tutorial="market-current-year-input"]', '[data-tutorial="market-current-value-input"]'],
    },
  ],
  tax: [
    {
      title: '5. Set taxable income',
      description:
        'Enter annual taxable income so negative gearing and tax benefit calculations are accurate.',
      targetSelectors: ['[data-tutorial="taxable-income-input"]'],
    },
    {
      title: '5. Review CGT treatment',
      description:
        'Review the CGT exemption toggle to model different ownership/use cases for the property.',
      targetSelectors: ['[data-tutorial="cgt-exempt-switch"]'],
    },
    {
      title: '5. Model future tax policy',
      description:
        'Open Tax Policy Modelling to test future policy scenarios like custom CGT discounts and quarantining property losses.',
      targetSelectors: ['[data-tutorial="tax-policy-trigger"]'],
    },
  ],
  purchase: [
    {
      title: '6. Review purchase costs',
      description:
        'Quick check: confirm state and your upfront fees (conveyancing and building/pest) to finalize acquisition costs.',
      targetSelectors: [
        '[data-tutorial="purchase-state-selector"]',
        '[data-tutorial="conveyancing-fee-input"]',
        '[data-tutorial="building-pest-fee-input"]',
      ],
    },
    {
      title: '7. Review investment overview',
      description:
        'Scroll to Investment Summary to review cash flow, ROI, and tax/equity metrics for the selected year.',
      targetSelectors: ['[data-tutorial="investment-overview-section"]'],
    },
    {
      title: '7. Review amortization table',
      description:
        'Use the yearly projections table to inspect loan balance, cash flow, and net position year by year.',
      targetSelectors: ['[data-tutorial="amortization-table-grid"]', '[data-tutorial="amortization-table-section"]'],
    },
  ],
};

const buildTabTourContent = (
  activeTab: string,
  tabFieldStep: number,
  nextTabToVisit: string | null
): CoachmarkContent => {
  const tabSteps = TAB_FIELD_STEPS[activeTab];
  if (tabSteps && tabSteps.length > 0) {
    const safeIndex = Math.max(0, Math.min(tabSteps.length - 1, tabFieldStep));
    const tabStep = tabSteps[safeIndex];
    const hasMoreSteps = safeIndex < tabSteps.length - 1;
    return {
      title: `${tabStep.title} (${safeIndex + 1}/${tabSteps.length})`,
      description: tabStep.description,
      targetSelectors: tabStep.targetSelectors,
      showAdvanceButton: true,
      advanceLabel: hasMoreSteps
        ? 'Next step'
        : (nextTabToVisit ? `Next: ${TAB_LABELS[nextTabToVisit] ?? nextTabToVisit}` : 'Next tab'),
    };
  }

  return {
    title: '2. Continue tab walkthrough',
    description: 'Use the next-tab button to continue the tutorial through each core input tab.',
    targetSelectors: ['[data-tutorial="tab-overview"]'],
    showAdvanceButton: true,
    advanceLabel: 'Next tab',
  };
};

const getContent = (
  step: TutorialStep,
  activeTab: string,
  tabFieldStep: number,
  nextTabToVisit: string | null,
  grapherStep: number
): CoachmarkContent => {
  if (step === 'create-scenario') {
    return {
      title: '1. Create your first scenario',
      description:
        'Open Scenarios, enter a scenario name, and click + to save the starting version before editing assumptions.',
      targetSelectors: ['[data-tutorial="scenario-name-input"]', '[data-tutorial="scenarios-menu-trigger"]'],
      showAdvanceButton: false,
    };
  }

  if (step === 'save-scenario') {
    return {
      title: '7. Save your scenario',
      description:
        'Click Save Changes so this version is captured and ready to compare in the scenario grapher.',
      targetSelectors: ['[data-tutorial="save-scenario-changes-button"]', '[data-tutorial="scenarios-menu-trigger"]'],
      showAdvanceButton: false,
    };
  }

  if (step === 'open-grapher') {
    const safeIndex = Math.max(0, Math.min(GRAPHER_STEPS.length - 1, grapherStep));
    const current = GRAPHER_STEPS[safeIndex];
    const hasMoreSteps = safeIndex < GRAPHER_STEPS.length - 1;
    return {
      title: `${current.title} (${safeIndex + 1}/${GRAPHER_STEPS.length})`,
      description: current.description,
      targetSelectors: current.targetSelectors,
      showAdvanceButton: true,
      advanceLabel: hasMoreSteps ? 'Next step' : 'Finish tutorial',
    };
  }

  return buildTabTourContent(activeTab, tabFieldStep, nextTabToVisit);
};

const getActiveSection = (step: TutorialStep, activeTab: string): TutorialSection | null => {
  if (step === 'open-grapher') return 'grapher';
  if (step === 'tab-tour' && SECTION_ORDER.includes(activeTab as TutorialSection)) {
    return activeTab as TutorialSection;
  }
  return null;
};

export function FirstRunTutorialCard({
  step,
  activeTab,
  nextTabToVisit,
  visitedCount,
  totalTabs,
  onShowNextTab,
  onOpenGrapher,
  onCompleteTabTour,
  onFinish,
  onDismiss,
}: FirstRunTutorialCardProps) {
  const [tabFieldStep, setTabFieldStep] = useState(0);
  const [grapherStep, setGrapherStep] = useState(0);
  const content = useMemo(
    () => getContent(step, activeTab, tabFieldStep, nextTabToVisit, grapherStep),
    [step, activeTab, tabFieldStep, nextTabToVisit, grapherStep]
  );
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [placement, setPlacement] = useState<'above' | 'below'>('above');
  const [arrowLeft, setArrowLeft] = useState(24);
  const cardRef = useRef<HTMLDivElement>(null);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const activeSection = getActiveSection(step, activeTab);

  useEffect(() => {
    setTabFieldStep(0);
    if (step !== 'open-grapher') {
      setGrapherStep(0);
    }
  }, [activeTab, step]);

  useEffect(() => {
    let retryCount = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const resolveTarget = () => {
      const nextTarget = findVisibleTarget(content.targetSelectors);
      if (nextTarget) {
        setTargetElement(nextTarget);
        return;
      }

      if (retryCount < 20) {
        retryCount += 1;
        timeoutId = setTimeout(resolveTarget, 60);
        return;
      }

      setTargetElement(null);
    };

    resolveTarget();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [content.targetSelectors, activeTab, step]);

  useEffect(() => {
    if (!targetElement) return;
    targetElement.classList.add('tutorial-target-highlight');
    return () => targetElement.classList.remove('tutorial-target-highlight');
  }, [targetElement]);

  useEffect(() => {
    if (!targetElement) return;
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }, [targetElement]);

  useEffect(() => {
    const updatePosition = () => {
      if (!targetElement || !cardRef.current) {
        setPosition(null);
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      const cardRect = cardRef.current.getBoundingClientRect();
      const margin = 12;
      const maxLeft = Math.max(8, window.innerWidth - cardRect.width - 8);
      const preferredLeft = rect.left + rect.width / 2 - cardRect.width / 2;
      const left = Math.max(8, Math.min(maxLeft, preferredLeft));

      const canRenderAbove = rect.top - cardRect.height - margin >= 8;
      const nextPlacement = canRenderAbove ? 'above' : 'below';
      const top = canRenderAbove
        ? rect.top - cardRect.height - margin
        : Math.min(window.innerHeight - cardRect.height - 8, rect.bottom + margin);

      const targetCenterX = rect.left + rect.width / 2;
      const arrowX = Math.max(16, Math.min(cardRect.width - 16, targetCenterX - left));

      setPlacement(nextPlacement);
      setArrowLeft(arrowX);
      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [targetElement, content.description, content.title, nextTabToVisit, visitedCount]);

  const useFallbackPosition = !position;
  const currentTabSteps = TAB_FIELD_STEPS[activeTab] ?? [];
  const hasMoreTabSteps = tabFieldStep < currentTabSteps.length - 1;
  const hasMoreGrapherSteps = grapherStep < GRAPHER_STEPS.length - 1;
  const canGoBack = (step === 'tab-tour' && tabFieldStep > 0) || (step === 'open-grapher' && grapherStep > 0);
  const handleBack = () => {
    if (step === 'tab-tour' && tabFieldStep > 0) {
      setTabFieldStep((prev) => Math.max(prev - 1, 0));
      return;
    }
    if (step === 'open-grapher' && grapherStep > 0) {
      setGrapherStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const sectionStates = SECTION_ORDER.map((section) => {
    const sectionIndex = SECTION_ORDER.indexOf(section);
    const activeIndex = activeSection ? SECTION_ORDER.indexOf(activeSection) : -1;
    const isActive = section === activeSection;
    let isDone = false;
    if (step === 'save-scenario') {
      isDone = section !== 'grapher';
    } else if (step === 'open-grapher') {
      isDone = sectionIndex < SECTION_ORDER.indexOf('grapher');
    } else if (step === 'tab-tour' && activeIndex >= 0) {
      isDone = sectionIndex < activeIndex;
    }
    return { section, isActive, isDone };
  });

  const handleAdvance = () => {
    if (step === 'open-grapher') {
      if (grapherStep === 0 && activeTab !== 'scenario-comparison') {
        onOpenGrapher();
        setGrapherStep(1);
        return;
      }
      if (hasMoreGrapherSteps) {
        setGrapherStep((prev) => Math.min(prev + 1, GRAPHER_STEPS.length - 1));
        return;
      }
      onFinish();
      return;
    }

    if (step === 'tab-tour' && currentTabSteps.length > 0 && hasMoreTabSteps) {
      setTabFieldStep((prev) => Math.min(prev + 1, currentTabSteps.length - 1));
      return;
    }
    if (step === 'tab-tour' && !nextTabToVisit) {
      onCompleteTabTour();
      return;
    }
    onShowNextTab();
  };

  return (
    <>
      <style>
        {`
          .tutorial-target-highlight {
            outline: 3px solid rgba(245, 158, 11, 0.85);
            outline-offset: 3px;
            border-radius: 10px;
            animation: tutorial-pulse 1.6s ease-in-out infinite;
          }
          @keyframes tutorial-pulse {
            0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.28); }
            70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
            100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
          }
        `}
      </style>

      <div
        ref={cardRef}
        className="fixed z-50 w-[min(380px,calc(100vw-1rem))] rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100 p-4 shadow-xl"
        style={
          useFallbackPosition
            ? { right: 8, bottom: 8 }
            : { top: position.top, left: position.left }
        }
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Guided setup</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{content.title}</p>
        <p className="mt-2 text-sm text-slate-700">{content.description}</p>
        <p className="mt-1 text-xs font-medium text-amber-700">Use the glowing field shown behind this popup.</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {sectionStates.map(({ section, isActive, isDone }) => (
            <span
              key={section}
              className={[
                'rounded-full px-2 py-0.5 text-[10px] font-medium',
                isActive
                  ? 'bg-amber-500 text-white'
                  : isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-200 text-slate-600',
              ].join(' ')}
            >
              {SECTION_LABELS[section]}
            </span>
          ))}
        </div>

        {step === 'tab-tour' && (
          <p className="mt-2 text-xs text-slate-600">
            Progress: {Math.min(visitedCount, totalTabs)}/{totalTabs} tabs
          </p>
        )}

        <div className="mt-3 flex items-center gap-2">
          {canGoBack && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-amber-300 bg-white text-amber-700 hover:bg-amber-50"
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          {content.showAdvanceButton && (
            <Button
              size="sm"
              className="h-8 bg-amber-500 px-3 text-white hover:bg-amber-600"
              onClick={handleAdvance}
            >
              {content.advanceLabel ?? (nextTabToVisit ? `Next: ${TAB_LABELS[nextTabToVisit] ?? nextTabToVisit}` : 'Next')}
            </Button>
          )}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="mt-2 h-7 px-2 text-xs text-slate-600 hover:text-slate-800"
          onClick={onDismiss}
        >
          Skip tutorial
        </Button>

        {!useFallbackPosition && (
          <div
            className="absolute h-3 w-3 rotate-45 border border-amber-200 bg-orange-100"
            style={
              placement === 'above'
                ? { bottom: -7, left: arrowLeft - 6 }
                : { top: -7, left: arrowLeft - 6 }
            }
          />
        )}
      </div>
    </>
  );
}
