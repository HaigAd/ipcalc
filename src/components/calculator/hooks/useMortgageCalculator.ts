import { useMemo } from 'react';
import { PropertyDetails } from '../types';
import { MortgageCalculation } from '../types/loan';

export const useMortgageCalculator = (propertyDetails: PropertyDetails): MortgageCalculation => {
  return useMemo(() => {
    const principal = propertyDetails.purchasePrice - propertyDetails.depositAmount;
    const monthlyRate = propertyDetails.interestRate / 12 / 100;
    const totalPayments = propertyDetails.loanTerm * 12;

    // Calculate monthly payment using the mortgage payment formula
    const monthlyPayment =
      (principal *
        monthlyRate *
        Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    const yearlySchedule = [];
    let remainingBalance = principal;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;

    yearlySchedule.push({
      year: 0,
      remainingBalance: Math.max(0, remainingBalance),
      interestPaid: 0,
      principalPaid: 0,
    });

    // Calculate yearly amortization schedule
    for (let yearIndex = 0; yearIndex < propertyDetails.loanTerm; yearIndex++) {
      const projectionYear = yearIndex + 1;
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;

      // Calculate monthly payments for the year
      for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;

        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        remainingBalance -= principalPayment;
      }

      totalInterestPaid += yearlyInterest;
      totalPrincipalPaid += yearlyPrincipal;

      yearlySchedule.push({
        year: projectionYear,
        remainingBalance: Math.max(0, remainingBalance),
        interestPaid: yearlyInterest,
        principalPaid: yearlyPrincipal,
      });
    }

    return {
      monthlyPayment,
      totalInterest: totalInterestPaid,
      totalPayment: totalInterestPaid + principal,
      yearlySchedule,
    };
  }, [propertyDetails]);
};
