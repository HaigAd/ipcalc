import { AustralianState } from '../types';
import { getStateCalculations } from './states';

export const calculateTransferFee = (price: number, state: AustralianState): number => {
    const stateCalculations = getStateCalculations(state);
    return stateCalculations.transferFee(price);
};
