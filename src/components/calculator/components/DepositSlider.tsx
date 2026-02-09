import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';
import { PropertyDetails, PurchaseCosts } from '../types';
import { useMemo, useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { Input } from '../../ui/input';
import { Pencil } from 'lucide-react';

interface DepositSliderProps {
  propertyDetails: PropertyDetails;
  purchaseCosts: PurchaseCosts;
  onDepositChange: (value: number[]) => void;
  onOpenPurchaseCostsDetails?: () => void;
}

export function DepositSlider({
  propertyDetails,
  purchaseCosts,
  onDepositChange,
  onOpenPurchaseCostsDetails,
}: DepositSliderProps) {
  const [inputValue, setInputValue] = useState(propertyDetails.depositAmount.toLocaleString());
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const minDepositAmount = useMemo(() => {
    return Math.max(propertyDetails.purchasePrice * 0.05, 0);
  }, [propertyDetails.purchasePrice]);

  const maxDepositAmount = useMemo(() => {
    return propertyDetails.purchasePrice;
  }, [propertyDetails.purchasePrice]);

  const depositPercentage = useMemo(() => {
    return (propertyDetails.depositAmount / propertyDetails.purchasePrice) * 100;
  }, [propertyDetails.depositAmount, propertyDetails.purchasePrice]);

  const totalUpfrontCosts = useMemo(() => {
    return propertyDetails.depositAmount + purchaseCosts.total;
  }, [propertyDetails.depositAmount, purchaseCosts.total]);
  const lmiTotal = purchaseCosts.lmi;
  const taxesAndFeesTotal =
    purchaseCosts.transferFee +
    purchaseCosts.stampDuty +
    purchaseCosts.mortgageRegistrationFee;
  const otherTotal =
    purchaseCosts.conveyancingFee +
    purchaseCosts.buildingAndPestFee -
    purchaseCosts.homeBuyerGrant;

  // Update input value when deposit amount changes externally
  useEffect(() => {
    if (!isEditing) {
      setInputValue(propertyDetails.depositAmount.toLocaleString());
    }
  }, [propertyDetails.depositAmount, isEditing]);

  // Handle direct input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  };

  // Handle input blur - validate and update deposit
  const handleInputBlur = () => {
    setIsEditing(false);
    const numericValue = Number(inputValue.replace(/,/g, '')) || 0;
    const newDeposit = Math.min(Math.max(numericValue, minDepositAmount), maxDepositAmount);
    onDepositChange([newDeposit]);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsEditing(true);
    setInputValue(propertyDetails.depositAmount.toString());
  };

  // Handle pencil click
  const handlePencilClick = () => {
    inputRef.current?.focus();
  };

  // Handle slider changes
  const handleDepositChange = (value: number[]) => {
    const newDeposit = Math.min(Math.max(value[0], minDepositAmount), maxDepositAmount);
    onDepositChange([newDeposit]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label className="text-sm font-medium text-slate-700">Deposit Amount</Label>
          <button
            onClick={handlePencilClick}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
            aria-label="Edit deposit amount"
          >
            <Pencil className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <div className="flex items-baseline space-x-2">
          <div className="flex items-center">
            <span className="text-2xl font-semibold text-slate-900 mr-1">$</span>
            <Input
              ref={inputRef}
              data-tutorial="deposit-amount-input"
              value={isEditing ? inputValue : Number(inputValue.replace(/,/g, '')).toLocaleString()}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              className={cn(
                "w-[140px] text-2xl font-semibold text-slate-900 border-none p-0 h-auto",
                "focus-visible:ring-0 hover:border-b-2 hover:border-slate-200 transition-all",
                isEditing ? "border-b-2 border-slate-300" : ""
              )}
            />
          </div>
          <span className="text-sm font-medium text-slate-500">
            ({depositPercentage.toFixed(1)}%)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <Slider
          value={[Math.min(Math.max(propertyDetails.depositAmount, minDepositAmount), maxDepositAmount)]}
          min={minDepositAmount}
          max={maxDepositAmount}
          step={1000}
          onValueChange={handleDepositChange}
          className="py-4"
        />
        
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <div className="space-y-1">
            <span className="block">Minimum</span>
            <span className="block text-slate-900">${minDepositAmount.toLocaleString()}</span>
            <span className="block text-slate-400">(5%)</span>
          </div>
          <div className="space-y-1 text-right">
            <span className="block">Maximum</span>
            <span className="block text-slate-900">${maxDepositAmount.toLocaleString()}</span>
            <span className="block text-slate-400">
              ({((maxDepositAmount / propertyDetails.purchasePrice) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="space-y-3 rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-700">Cost Breakdown</h3>
            {onOpenPurchaseCostsDetails && (
              <button
                type="button"
                onClick={onOpenPurchaseCostsDetails}
                className="text-xs font-medium text-blue-700 hover:text-blue-800"
              >
                View details
              </button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">LMI</span>
              <span className="font-medium text-slate-900">${Math.round(lmiTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Taxes & Fees</span>
              <span className="font-medium text-slate-900">${Math.round(taxesAndFeesTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Other</span>
              <span className="font-medium text-slate-900">${Math.round(otherTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Purchase Costs [{purchaseCosts.state}]</span>
              <span className="font-medium text-slate-900">${purchaseCosts.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Upfront</span>
              <span className="font-medium text-slate-900">${totalUpfrontCosts.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Loan Principal</span>
                <span className="font-medium text-slate-900">
                  ${(Math.max(propertyDetails.purchasePrice - propertyDetails.depositAmount, 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
