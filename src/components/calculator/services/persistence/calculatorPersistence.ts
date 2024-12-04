import { 
  PropertyDetails, 
  MarketData, 
  CostStructure 
} from '../../types';

interface CalculatorState {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  costStructure: CostStructure;
}

const STORAGE_KEY = 'calculator_state';

export const calculatorPersistence = {
  saveState: (state: CalculatorState): void => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (err) {
      console.error('Failed to save calculator state:', err);
    }
  },

  loadState: (): CalculatorState | null => {
    try {
      const serializedState = localStorage.getItem(STORAGE_KEY);
      if (!serializedState) return null;
      return JSON.parse(serializedState);
    } catch (err) {
      console.error('Failed to load calculator state:', err);
      return null;
    }
  },

  clearState: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear calculator state:', err);
    }
  }
};

export type { CalculatorState };
