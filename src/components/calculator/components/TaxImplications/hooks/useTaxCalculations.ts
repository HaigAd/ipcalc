import { useState } from 'react';
import { PropertyDetails } from '../../../types';
import { getTaxBracket, calculateTaxPayable } from '../../../calculations/taxCalculations';

interface UseTaxCalculationsProps {
  propertyDetails: PropertyDetails;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
  firstYearProjection?: {
    taxBenefit: number;
    taxableIncome: number;
    cgtPayable: number;
  };
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
  base: number;
}

export function useTaxCalculations({
  propertyDetails,
  onPropertyDetailsChange,
  firstYearProjection
}: UseTaxCalculationsProps) {
  const [inputValue, setInputValue] = useState(propertyDetails.taxableIncome.toString());

  const handleIncomeChange = (value: string) => {
    if (value === '' || /^\d*$/.test(value)) {
      setInputValue(value);
      const income = value === '' ? 0 : parseInt(value, 10);
      onPropertyDetailsChange({
        ...propertyDetails,
        taxableIncome: income
      });
    }
  };

  const handleBlur = () => {
    const income = inputValue === '' ? 0 : parseInt(inputValue, 10);
    setInputValue(income.toLocaleString());
  };

  const handleFocus = () => {
    setInputValue(propertyDetails.taxableIncome.toString());
  };

  const handleDepreciationChange = (type: 'capitalWorks' | 'plantEquipment', value: string) => {
    const numericValue = Number(value.replace(/[^0-9]/g, '')) || 0;
    onPropertyDetailsChange({
      ...propertyDetails,
      [type === 'capitalWorks' ? 'capitalWorksDepreciation' : 'plantEquipmentDepreciation']: numericValue
    });
  };

  const handleCGTExemptionChange = (checked: boolean) => {
    onPropertyDetailsChange({
      ...propertyDetails,
      isCGTExempt: checked
    });
  };

  // Calculate tax implications
  const bracket = getTaxBracket(propertyDetails.taxableIncome);
  const taxPayable = calculateTaxPayable(propertyDetails.taxableIncome);
  const totalDepreciation = 
    propertyDetails.capitalWorksDepreciation + 
    propertyDetails.plantEquipmentDepreciation;

  // First year calculations
  const taxBenefit = firstYearProjection?.taxBenefit || 0;
  const firstYearIncomeLoss = firstYearProjection?.taxableIncome || 0;
  const finalTaxableIncome = propertyDetails.taxableIncome + firstYearIncomeLoss;

  return {
    inputValue,
    handleIncomeChange,
    handleBlur,
    handleFocus,
    handleDepreciationChange,
    handleCGTExemptionChange,
    calculations: {
      bracket,
      taxPayable,
      totalDepreciation,
      taxBenefit,
      firstYearIncomeLoss,
      finalTaxableIncome,
      monthlyBenefit: taxBenefit / 12
    }
  };
}
