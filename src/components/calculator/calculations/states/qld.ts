import { StateCalculations } from './types';

export const calculateQLDStampDuty = (price: number, isPPOR: boolean, isFirstHomeBuyer: boolean): number => {
    // First home buyer exemption
    if (isFirstHomeBuyer && price < 800000) {
        return 0;
    }
    
    // Calculate base duty
    let duty = 0;
    if (price <= 5000) {
        duty = 0;
    } else if (price <= 75000) {
        const dutiableAmount = price - 5000;
        duty = Math.ceil(dutiableAmount / 100) * 1.50;
    } else if (price <= 540000) {
        const dutiableAmount = price - 75000;
        duty = 1050 + (Math.ceil(dutiableAmount / 100) * 3.50);
    } else if (price <= 1000000) {
        const dutiableAmount = price - 540000;
        duty = 17325 + (Math.ceil(dutiableAmount / 100) * 4.50);
    } else {
        const dutiableAmount = price - 1000000;
        duty = 38025 + (Math.ceil(dutiableAmount / 100) * 5.75);
    }

    // Apply PPOR discount if applicable
    if (isPPOR) {
        duty = Math.max(0, duty - 7125);
    }

    return Math.round(duty);
};

export const calculateQLDTransferFee = (price: number): number => {
    // Base fee for first lot
    const baseFee = 231.98;
    
    // If price is 180k or less, only base fee applies
    if (price <= 180000) {
        return baseFee;
    }
    
    // Calculate additional fee for amount over 180k
    // $43.56 for each 10k or part thereof over 180k
    const amountOver180k = price - 180000;
    const numberOf10kBlocks = Math.ceil(amountOver180k / 10000);
    const additionalFee = numberOf10kBlocks * 43.56;
    
    return baseFee + additionalFee;
};

const qldCalculations: StateCalculations = {
    stampDuty: calculateQLDStampDuty,
    transferFee: calculateQLDTransferFee,
};

export default qldCalculations;
