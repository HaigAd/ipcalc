import { AustralianState } from '../types';
import { getStateCalculations } from './states';

export const calculateStampDuty = (
    price: number, 
    isPPOR: boolean, 
    isFirstHomeBuyer: boolean,
    state: AustralianState
): number => {
    const stateCalculations = getStateCalculations(state);
    return stateCalculations.stampDuty(price, isPPOR, isFirstHomeBuyer);
};
