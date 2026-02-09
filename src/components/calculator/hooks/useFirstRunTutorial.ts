import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'calculator_tutorial_v1';

const TAB_TOUR_ORDER = ['overview', 'income', 'market', 'tax', 'purchase'] as const;

type TutorialTabId = (typeof TAB_TOUR_ORDER)[number];
export type TutorialStep = 'create-scenario' | 'tab-tour' | 'save-scenario' | 'open-grapher' | 'done';

interface TutorialStorage {
  completed: boolean;
}

interface UseFirstRunTutorialProps {
  scenariosCount: number;
  hasChanges: boolean;
  activeTab: string;
  tabTourCompleted: boolean;
}

const readStoredTutorialState = (): TutorialStorage => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { completed: false };
    }
    const parsed = JSON.parse(raw) as TutorialStorage;
    return { completed: Boolean(parsed.completed) };
  } catch {
    return { completed: false };
  }
};

const writeStoredTutorialState = (state: TutorialStorage) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const isTourTab = (tabId: string): tabId is TutorialTabId => {
  return TAB_TOUR_ORDER.includes(tabId as TutorialTabId);
};

export const useFirstRunTutorial = ({
  scenariosCount,
  hasChanges,
  activeTab,
  tabTourCompleted,
}: UseFirstRunTutorialProps) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => !readStoredTutorialState().completed);
  const [step, setStep] = useState<TutorialStep>(() =>
    readStoredTutorialState().completed ? 'done' : 'create-scenario'
  );
  const [visitedTabs, setVisitedTabs] = useState<Set<TutorialTabId>>(new Set());

  useEffect(() => {
    if (!isEnabled || step !== 'tab-tour') return;
    if (!isTourTab(activeTab)) return;

    setVisitedTabs(prev => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab, isEnabled, step]);

  useEffect(() => {
    if (!isEnabled) return;

    if (step === 'create-scenario' && scenariosCount > 0) {
      setStep('tab-tour');
      return;
    }

    if (step === 'tab-tour') {
      if (tabTourCompleted) {
        setStep(hasChanges ? 'save-scenario' : 'open-grapher');
      }
      return;
    }

    if (step === 'save-scenario' && !hasChanges) {
      setStep('open-grapher');
      return;
    }

  }, [activeTab, hasChanges, isEnabled, scenariosCount, step, tabTourCompleted, visitedTabs]);

  const completeTutorial = useCallback(() => {
    writeStoredTutorialState({ completed: true });
    setIsEnabled(false);
    setStep('done');
  }, []);

  const nextTabToVisit = useMemo(
    () => TAB_TOUR_ORDER.find(tabId => !visitedTabs.has(tabId)) ?? null,
    [visitedTabs]
  );

  return {
    isActive: isEnabled && step !== 'done',
    step,
    nextTabToVisit,
    visitedCount: visitedTabs.size,
    totalTabs: TAB_TOUR_ORDER.length,
    completeTutorial,
  };
};
