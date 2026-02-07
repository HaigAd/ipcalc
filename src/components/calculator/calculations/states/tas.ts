import { StateCalculations } from './types';

const calculateTASBaseDuty = (price: number): number => {
    if (price <= 3000) {
        return 50;
    } else if (price <= 25000) {
        const amountOver3k = price - 3000;
        // $50 plus $1.75 for every $100 or part over $3,000
        return Math.round(50 + (Math.ceil(amountOver3k / 100) * 1.75));
    } else if (price <= 75000) {
        const amountOver25k = price - 25000;
        // $435 plus $2.25 for every $100 or part over $25,000
        return Math.round(435 + (Math.ceil(amountOver25k / 100) * 2.25));
    } else if (price <= 200000) {
        const amountOver75k = price - 75000;
        // $1,560 plus $3.50 for every $100 or part over $75,000
        return Math.round(1560 + (Math.ceil(amountOver75k / 100) * 3.50));
    } else if (price <= 375000) {
        const amountOver200k = price - 200000;
        // $5,935 plus $4.00 for every $100 or part over $200,000
        return Math.round(5935 + (Math.ceil(amountOver200k / 100) * 4.00));
    } else if (price <= 725000) {
        const amountOver375k = price - 375000;
        // $12,935 plus $4.25 for every $100 or part over $375,000
        return Math.round(12935 + (Math.ceil(amountOver375k / 100) * 4.25));
    } else {
        const amountOver725k = price - 725000;
        // $27,810 plus $4.50 for every $100 or part over $725,000
        return Math.round(27810 + (Math.ceil(amountOver725k / 100) * 4.50));
    }
};

export const calculateTASStampDuty = (price: number, _isPPOR: boolean, isFirstHomeBuyer: boolean): number => {
    // First home buyer exemption for properties under $750,000
    if (isFirstHomeBuyer && price <= 750000) {
        return 0;
    }

    return calculateTASBaseDuty(price);
};

export const calculateTASTransferFee = (price: number): number => {
    void price;
    // Using a default transfer fee calculation until actual TAS transfer fee details are available
    return 233;
};

const tasCalculations: StateCalculations = {
    stampDuty: calculateTASStampDuty,
    transferFee: calculateTASTransferFee,
};

export default tasCalculations;
