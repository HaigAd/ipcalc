import React from 'react';
import { CalculatorProvider } from './context/CalculatorContext';
import { PropertyDetailsForm } from './components/PropertyDetailsForm';
import { MarketDataForm } from './components/MarketDataForm';
import { LoanDetailsForm } from './components/LoanDetailsForm';
import { PurchaseCostsForm } from './components/PurchaseCostsForm';
import { YearlyProjectionsTable } from './components/YearlyProjectionsTable';
import { KeyMetrics } from './components/KeyMetrics';
import { ProjectionsGraph } from './components/ProjectionsGraph';
import { MarketScenarios } from './components/MarketScenarios';

export function RentVsBuyCalculator() {
  return (
    <CalculatorProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Rent vs Buy Calculator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <PropertyDetailsForm />
          <MarketDataForm />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <LoanDetailsForm />
          <PurchaseCostsForm />
        </div>

        <div className="mb-8">
          <KeyMetrics />
        </div>

        <div className="mb-8">
          <ProjectionsGraph />
        </div>

        <div className="mb-8">
          <MarketScenarios />
        </div>

        <div className="mb-8">
          <YearlyProjectionsTable />
        </div>
      </div>
    </CalculatorProvider>
  );
}
