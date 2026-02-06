export function calculateYearlyRates(
    baseRate: number,
    loanLengthYears: number,
    interestRateChanges?: { year: number; rate: number }[]
): number[] {
    // Input validation
    if (loanLengthYears <= 0) {
        throw new Error('Loan length must be positive');
    }

    // Initialize array with base rate
    const yearlyRates = new Array(loanLengthYears).fill(baseRate);
    
    // If no rate changes, return array filled with base rate
    if (!interestRateChanges || interestRateChanges.length === 0) {
        return yearlyRates;
    }
    
    // Sort rate changes by year to ensure correct order
    const sortedChanges = [...interestRateChanges].sort((a, b) => a.year - b.year);
    
    // Apply rate changes
    for (const { year, rate } of sortedChanges) {
        // Validate year is within loan period
        if (year < 0 || year >= loanLengthYears) {
            throw new Error(`Invalid year ${year}. Must be between 0 and ${loanLengthYears - 1}`);
        }
        
        // Apply rate change from specified year until the next change or end of loan
        for (let i = year; i < loanLengthYears; i++) {
            yearlyRates[i] = rate;
        }
    }
    return yearlyRates;
}
