import { StateCalculations } from './types';

const calculateWAGeneralRate = (price: number): number => {
    if (price <= 120000) {
        // $1.90 per $100 or part thereof
        return Math.ceil(price / 100) * 1.90;
    } else if (price <= 150000) {
        // $2,280 + $2.85 per $100 or part thereof above $120,000
        const amountOver120k = price - 120000;
        return Math.round(2280 + (Math.ceil(amountOver120k / 100) * 2.85));
    } else if (price <= 360000) {
        // $3,135 + $3.80 per $100 or part thereof above $150,000
        const amountOver150k = price - 150000;
        return Math.round(3135 + (Math.ceil(amountOver150k / 100) * 3.80));
    } else if (price <= 725000) {
        // $11,115 + $4.75 per $100 or part thereof above $360,000
        const amountOver360k = price - 360000;
        return Math.round(11115 + (Math.ceil(amountOver360k / 100) * 4.75));
    } else {
        // $28,453 + $5.15 per $100 or part thereof above $725,000
        const amountOver725k = price - 725000;
        return Math.round(28453 + (Math.ceil(amountOver725k / 100) * 5.15));
    }
};

const calculateWAConcessionalRate = (price: number): number => {
    if (price <= 120000) {
        // $1.50 per $100 or part thereof
        return Math.ceil(price / 100) * 1.50;
    } else if (price <= 200000) {
        // $1,800 + $4.04 per $100 or part thereof above $120,000
        const amountOver120k = price - 120000;
        return Math.round(1800 + (Math.ceil(amountOver120k / 100) * 4.04));
    }
    // Above $200,000 uses general rate
    return calculateWAGeneralRate(price);
};

const calculateWAFirstHomeOwnerRate = (price: number, isVacantLand: boolean): number => {
    if (isVacantLand) {
        if (price <= 300000) {
            return 0;
        } else if (price <= 400000) {
            // $13.01 per $100 or part thereof above $300,000
            const amountOver300k = price - 300000;
            return Math.round(Math.ceil(amountOver300k / 100) * 13.01);
        }
    } else {
        // Post May 9, 2024 rates for homes
        if (price <= 450000) {
            return 0;
        } else if (price <= 600000) {
            // $15.01 per $100 or part thereof above $450,000
            const amountOver450k = price - 450000;
            return Math.round(Math.ceil(amountOver450k / 100) * 15.01);
        }
    }
    
    // Above thresholds uses general rate
    return calculateWAGeneralRate(price);
};

export const calculateWAStampDuty = (price: number, isPPOR: boolean, isFirstHomeBuyer: boolean): number => {
    // First check first home buyer rates
    if (isFirstHomeBuyer) {
        // Assuming not vacant land for now - would need additional parameter for this distinction
        return calculateWAFirstHomeOwnerRate(price, false);
    }

    // Then check concessional rate for PPOR under $200,000
    if (isPPOR && price <= 200000) {
        return calculateWAConcessionalRate(price);
    }

    // Otherwise use general rate
    return calculateWAGeneralRate(price);
};

export const calculateWATransferFee = (price: number): number => {
    if (price <= 85000) {
        return 210.30;
    } else if (price <= 120000) {
        return 220.30;
    } else {
        // Base fee for properties over 120k
        const baseFee = 220.30;
        
        // Calculate which bracket the price falls into
        // Each bracket is 100k, starting from 120k
        // 120k-200k is first bracket, 200k-300k is second, etc.
        const bracket = Math.floor((price - 1) / 100000);
        
        // Properties between 120k-200k are in the first bracket (index 1)
        // So we need to subtract 1 from brackets below 200k
        const adjustedBracket = price <= 200000 ? 1 : bracket;
        
        const additionalFee = adjustedBracket * 20.00;
        return baseFee + additionalFee;
    }
};

const waCalculations: StateCalculations = {
    stampDuty: calculateWAStampDuty,
    transferFee: calculateWATransferFee,
};

export default waCalculations;
