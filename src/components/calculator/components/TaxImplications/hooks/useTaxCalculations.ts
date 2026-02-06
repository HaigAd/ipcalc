import { useState } from 'react';
import { PropertyDetails } from '../../../types/property';
import { getTaxBracket, calculateTaxPayable } from '../../../calculations/taxCalculations';
import { getDepreciation, DepreciationMode } from '../../../utils/depreciation';

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
    const newSchedule = {
      ...propertyDetails.depreciationSchedule,
      mode: 'fixed' as DepreciationMode,
      [`fixed${type === 'capitalWorks' ? 'CapitalWorks' : 'PlantEquipment'}`]: numericValue
    };
    onPropertyDetailsChange({
      ...propertyDetails,
      depreciationSchedule: newSchedule
    });
  };

  const handleCGTExemptionChange = (checked: boolean) => {
    onPropertyDetailsChange({
      ...propertyDetails,
      isCGTExempt: checked
    });
  };

  const handleCGTDiscountToggle = (checked: boolean) => {
    onPropertyDetailsChange({
      ...propertyDetails,
      useCustomCGTDiscount: checked
    });
  };

  const handleCGTDiscountRateChange = (value: string) => {
    const numericValue = Number(value);
    const sanitized = Number.isFinite(numericValue)
      ? Math.min(100, Math.max(0, numericValue))
      : 0;
    onPropertyDetailsChange({
      ...propertyDetails,
      cgtDiscountRate: sanitized / 100
    });
  };

  const handleNoNegativeGearingToggle = (checked: boolean) => {
    onPropertyDetailsChange({
      ...propertyDetails,
      noNegativeGearing: checked
    });
  };

  const handleNoNegativeGearingYearChange = (value: string) => {
    const numericValue = Number(value);
    const sanitized = Number.isFinite(numericValue)
      ? Math.max(1, Math.floor(numericValue))
      : 1;
    onPropertyDetailsChange({
      ...propertyDetails,
      noNegativeGearingStartYear: sanitized
    });
  };

  // Calculate tax implications
  const bracket = getTaxBracket(propertyDetails.taxableIncome);
  const taxPayable = calculateTaxPayable(propertyDetails.taxableIncome);
  
  // Get first year depreciation
  const firstYearDepreciation = getDepreciation(propertyDetails.depreciationSchedule, 1);
  const totalDepreciation = firstYearDepreciation.capitalWorks + firstYearDepreciation.plantEquipment;

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
    handleCGTDiscountToggle,
    handleCGTDiscountRateChange,
    handleNoNegativeGearingToggle,
    handleNoNegativeGearingYearChange,
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
