import { AustralianState } from '../../types';
import { StateCalculations } from './types';
import nswCalculations from './nsw';
import vicCalculations from './vic';
import qldCalculations from './qld';
import saCalculations from './sa';
import waCalculations from './wa';
import ntCalculations from './nt';
import tasCalculations from './tas';
import actCalculations from './act';

// Default calculations for states that haven't been implemented yet
const defaultCalculations: StateCalculations = {
    stampDuty: (price: number) => price * 0.03,
    transferFee: (price: number) => price * 0.03,
};

export const getStateCalculations = (state: AustralianState): StateCalculations => {
    switch (state) {
        case 'NSW':
            return nswCalculations;
        case 'VIC':
            return vicCalculations;
        case 'QLD':
            return qldCalculations;
        case 'SA':
            return saCalculations;
        case 'WA':
            return waCalculations;
        case 'NT':
            return ntCalculations;
        case 'TAS':
            return tasCalculations;
        case 'ACT':
            return actCalculations;
        default:
            return defaultCalculations;
    }
};

export * from './types';
