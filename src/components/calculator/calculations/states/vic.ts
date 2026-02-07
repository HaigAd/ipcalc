import { StateCalculations } from './types';

const calculateVICBaseDuty = (price: number): number => {
    if (price <= 25000) {
        // 1.4% of property value
        return Math.round(price * 0.014);
    } else if (price <= 130000) {
        // $350 plus 2.4% for every dollar over $25,000
        const amountOver25k = price - 25000;
        return Math.round(350 + (amountOver25k * 0.024));
    } else if (price <= 960000) {
        // $2,870 plus 6% for every dollar over $130,000
        const amountOver130k = price - 130000;
        return Math.round(2870 + (amountOver130k * 0.06));
    } else {
        // 5.5% of total dutiable value
        return Math.round(price * 0.055);
    }
};

export const calculateVICStampDuty = (price: number, _isPPOR: boolean, isFirstHomeBuyer: boolean): number => {
    // First home buyer exemptions
    if (isFirstHomeBuyer) {
        if (price <= 600000) {
            return 0;
        }
        // Concession for properties between $600,001 and $750,000
        // TODO: Implement specific concession calculation when details are available
        if (price <= 750000) {
            // For now, applying a proportional reduction
            const normalDuty = calculateVICBaseDuty(price);
            const concessionFactor = (750000 - price) / (750000 - 600000);
            return Math.round(normalDuty * (1 - concessionFactor));
        }
    }

    return calculateVICBaseDuty(price);
};

export const calculateVICTransferFee = (price: number): number => {
    // Base fee
    let fee = 98.60;
    
    // Add $2.34 for every whole $1,000
    const wholeThousands = Math.floor(price / 1000);
    fee += wholeThousands * 2.34;
    
    // Cap at maximum fee
    return Math.min(Math.round(fee * 100) / 100, 3609.00);
};

const vicCalculations: StateCalculations = {
    stampDuty: calculateVICStampDuty,
    transferFee: calculateVICTransferFee,
};

export default vicCalculations;
