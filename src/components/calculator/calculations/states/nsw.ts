import { StateCalculations } from './types';

export const calculateNSWStampDuty = (price: number, isPPOR: boolean, isFirstHomeBuyer: boolean): number => {
    // First home buyer exemption
    if (isFirstHomeBuyer && price < 800000) {
        return 0;
    }

    let duty = 0;
    if (price <= 17000) {
        // $1.25 for every $100 (minimum $20)
        const fee = Math.ceil(price / 100) * 1.25;
        duty = Math.max(20, fee);
    } else if (price <= 36000) {
        // $212 plus $1.50 for every $100 over $17,000
        const amountOver17k = price - 17000;
        duty = 212 + (Math.ceil(amountOver17k / 100) * 1.50);
    } else if (price <= 97000) {
        // $497 plus $1.75 for every $100 over $36,000
        const amountOver36k = price - 36000;
        duty = 497 + (Math.ceil(amountOver36k / 100) * 1.75);
    } else if (price <= 364000) {
        // $1,564 plus $3.50 for every $100 over $97,000
        const amountOver97k = price - 97000;
        duty = 1564 + (Math.ceil(amountOver97k / 100) * 3.50);
    } else if (price <= 1212000) {
        // $10,909 plus $4.50 for every $100 over $364,000
        const amountOver364k = price - 364000;
        duty = 10909 + (Math.ceil(amountOver364k / 100) * 4.50);
    } else {
        // $49,069 plus $5.50 for every $100 over $1,212,000
        const amountOver1212k = price - 1212000;
        duty = 49069 + (Math.ceil(amountOver1212k / 100) * 5.50);
    }

    // Apply PPOR discount if applicable
    if (isPPOR) {
        duty = Math.max(0, duty - 7125);
    }

    return Math.round(duty);
};

export const calculateNSWTransferFee = (price: number): number => {
    void price;
    //FLAT RATE IN NSW
    return 165.40;
};

const nswCalculations: StateCalculations = {
    stampDuty: calculateNSWStampDuty,
    transferFee: calculateNSWTransferFee,
};

export default nswCalculations;
