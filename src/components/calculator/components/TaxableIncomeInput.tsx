import { PropertyDetails } from '../types';
import { Input } from '../../ui/input';
import { getTaxBracket, TAX_BRACKETS } from '../calculations/taxCalculations';
import { useState } from 'react';

interface TaxableIncomeInputProps {
  propertyDetails: PropertyDetails;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
}

export function TaxableIncomeInput({ propertyDetails, onPropertyDetailsChange }: TaxableIncomeInputProps) {
  const [inputValue, setInputValue] = useState(propertyDetails.taxableIncome.toString());

  const handleIncomeChange = (value: string) => {
    // Allow empty input or numbers only
    if (value === '' || /^\d*$/.test(value)) {
      setInputValue(value);
      
      // Update property details with numeric value
      const income = value === '' ? 0 : parseInt(value, 10);
      onPropertyDetailsChange({
        ...propertyDetails,
        taxableIncome: income
      });
    }
  };

  const handleBlur = () => {
    // Format the number on blur
    const income = inputValue === '' ? 0 : parseInt(inputValue, 10);
    setInputValue(income.toLocaleString());
  };

  const handleFocus = () => {
    // Remove formatting when input is focused
    setInputValue(propertyDetails.taxableIncome.toString());
  };

  const bracket = getTaxBracket(propertyDetails.taxableIncome);
  const description = bracket ? `${(bracket.rate * 100).toFixed(1)}c for each $1 over $${bracket.min.toLocaleString()}` : 'No tax payable';

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
        <p className="font-medium">Your Tax Bracket:</p>
        <p className="text-gray-600">
          Marginal Rate: {bracket ? (bracket.rate * 100).toFixed(1) : 0}%
        </p>
        <p className="text-gray-600 text-xs">
          {description}
        </p>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p className="font-medium mb-1">Tax Brackets 2023-24:</p>
        {TAX_BRACKETS.map((b, i) => (
          <p key={i} className={`${propertyDetails.taxableIncome >= b.min && propertyDetails.taxableIncome <= b.max ? 'font-medium' : ''}`}>
            ${b.min.toLocaleString()} - ${b.max === Infinity ? '∞' : `$${b.max.toLocaleString()}`}: {(b.rate * 100).toFixed(1)}%
          </p>
        ))}
      </div>

      <p className="mt-3 text-xs italic text-gray-500">
        Your taxable income affects the tax benefits from negative gearing. Higher income means larger tax savings from property deductions.
      </p>
    </div>
  );
}
