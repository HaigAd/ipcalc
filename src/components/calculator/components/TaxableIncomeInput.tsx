import { PropertyDetails } from '../types';
import { Input } from '../../ui/input';
import { getTaxBracket, calculateTaxPayable, TAX_BRACKETS } from '../calculations/taxCalculations';
import { useState } from 'react';

interface TaxableIncomeInputProps {
  propertyDetails: PropertyDetails;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
}

export function TaxableIncomeInput({ propertyDetails, onPropertyDetailsChange }: TaxableIncomeInputProps) {
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

  const bracket = getTaxBracket(propertyDetails.taxableIncome);
  const taxPayable = calculateTaxPayable(propertyDetails.taxableIncome);
  
  let description = 'Nil';
  if (bracket && bracket.rate > 0) {
    if (bracket.base > 0) {
      description = `$${bracket.base.toLocaleString()} plus ${(bracket.rate * 100)}c for each $1 over $${bracket.min.toLocaleString()}`;
    } else {
      description = `${(bracket.rate * 100)}c for each $1 over $${bracket.min.toLocaleString()}`;
    }
  }

  return (
    <div className="mb-4 p-3 bg-gray-100 rounded-md">
      <div className="mb-2">
        <label htmlFor="taxableIncome" className="block text-sm font-medium mb-1">
          Your Annual Taxable Income
        </label>
        <Input
          id="taxableIncome"
          type="text"
          value={inputValue}
          onChange={(e) => handleIncomeChange(e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className="w-full"
          placeholder="Enter your annual taxable income"
        />
      </div>
      
      <div className="mt-2 text-sm">
        <p className="font-medium">Tax Bracket:</p>
        <p className="text-gray-600">
          ${bracket?.min.toLocaleString()} - ${bracket?.max === Infinity ? '∞' : bracket?.max.toLocaleString()}
        </p>
        <p className="text-gray-600">
          {description}
        </p>
        <p className="mt-2 font-medium">
          Tax Payable: ${Math.round(taxPayable).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
