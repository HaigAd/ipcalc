import { StateCalculations } from './types';

const calculateNTBaseDuty = (price: number): number => {
    if (price <= 525000) {
        // For values up to $525,000:
        // Duty = (0.06571441 × V²) + 15V, where V is price/1000
        const v = price / 1000;
        return Math.round((0.06571441 * v * v) + (15 * v));
    } else if (price <= 3000000) {
        // 4.95% of the value
        return Math.round(price * 0.0495);
    } else if (price <= 5000000) {
        // 5.75% of the value
        return Math.round(price * 0.0575);
    } else {
        // 5.95% of the value for more than $5 million
        return Math.round(price * 0.0595);
    }
};

export const calculateNTStampDuty = (price: number, isPPOR: boolean, isFirstHomeBuyer: boolean): number => {
    void isPPOR;
    void isFirstHomeBuyer;
    return calculateNTBaseDuty(price);
};

export const calculateNTTransferFee = (price: number): number => {
    void price;
    // Using a default transfer fee calculation until actual NT transfer fee details are provided
    return 165; //flate rate
};

const ntCalculations: StateCalculations = {
    stampDuty: calculateNTStampDuty,
    transferFee: calculateNTTransferFee,
};

export default ntCalculations;
