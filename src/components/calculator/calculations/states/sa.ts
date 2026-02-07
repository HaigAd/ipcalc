import { StateCalculations } from './types';

const calculateSABaseDuty = (price: number): number => {
    if (price <= 12000) {
        // $1.00 for every $100 or part of $100
        return Math.ceil(price / 100);
    } else if (price <= 30000) {
        // $120 plus $2.00 for every $100 or part of $100 over $12,000
        const amountOver12k = price - 12000;
        return Math.round(120 + (Math.ceil(amountOver12k / 100) * 2));
    } else if (price <= 50000) {
        // $480 plus $3.00 for every $100 or part of $100 over $30,000
        const amountOver30k = price - 30000;
        return Math.round(480 + (Math.ceil(amountOver30k / 100) * 3));
    } else if (price <= 100000) {
        // $1,080 plus $3.50 for every $100 or part of $100 over $50,000
        const amountOver50k = price - 50000;
        return Math.round(1080 + (Math.ceil(amountOver50k / 100) * 3.5));
    } else if (price <= 200000) {
        // $2,830 plus $4.00 for every $100 or part of $100 over $100,000
        const amountOver100k = price - 100000;
        return Math.round(2830 + (Math.ceil(amountOver100k / 100) * 4));
    } else if (price <= 250000) {
        // $6,830 plus $4.25 for every $100 or part of $100 over $200,000
        const amountOver200k = price - 200000;
        return Math.round(6830 + (Math.ceil(amountOver200k / 100) * 4.25));
    } else if (price <= 300000) {
        // $8,955 plus $4.75 for every $100 or part of $100 over $250,000
        const amountOver250k = price - 250000;
        return Math.round(8955 + (Math.ceil(amountOver250k / 100) * 4.75));
    } else if (price <= 500000) {
        // $11,330 plus $5.00 for every $100 or part of $100 over $300,000
        const amountOver300k = price - 300000;
        return Math.round(11330 + (Math.ceil(amountOver300k / 100) * 5));
    } else {
        // $21,330 plus $5.50 for every $100 or part of $100 over $500,000
        const amountOver500k = price - 500000;
        return Math.round(21330 + (Math.ceil(amountOver500k / 100) * 5.5));
    }
};

export const calculateSAStampDuty = (price: number, _isPPOR: boolean, isFirstHomeBuyer: boolean): number => {
    if (isFirstHomeBuyer) {
        // Full exemption for existing homes up to $650,000
        if (price <= 650000) {
            return 0;
        }
        
        // Partial relief for homes between $650,001 and $700,000
        if (price <= 700000) {
            const normalDuty = calculateSABaseDuty(price);
            const concessionFactor = (700000 - price) / (700000 - 650000);
            return Math.round(normalDuty * (1 - concessionFactor));
        }
    }

    return calculateSABaseDuty(price);
};

export const calculateSATransferFee = (price: number): number => {
    // Base fees for different tiers
    if (price <= 5000) {
        return 192;
    } else if (price <= 20000) {
        return 215;
    } else if (price <= 40000) {
        return 236;
    } else {
        // For values over $40,000, it's $332 plus $99 for every $10,000 or part thereof above $50,000
        let fee = 332;
        
        // Only add additional fees if price is over $50,000
        if (price > 50000) {
            const amountOver50k = price - 50000;
            // Calculate how many $10,000 blocks (or part thereof) are above $50,000
            const blocks = Math.ceil(amountOver50k / 10000);
            fee += blocks * 99;
        }
        
        return fee;
    }
};

const saCalculations: StateCalculations = {
    stampDuty: calculateSAStampDuty,
    transferFee: calculateSATransferFee,
};

export default saCalculations;
