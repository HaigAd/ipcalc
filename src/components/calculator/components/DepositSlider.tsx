import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';
import { PropertyDetails, PurchaseCosts } from '../types';
import { useMemo } from 'react';

interface DepositSliderProps {
  propertyDetails: PropertyDetails;
  purchaseCosts: PurchaseCosts;
  onDepositChange: (value: number[]) => void;
}

export function DepositSlider({ propertyDetails, purchaseCosts, onDepositChange }: DepositSliderProps) {
  const minDepositAmount = useMemo(() => {
    return Math.max(propertyDetails.purchasePrice * 0.05, 0);
  }, [propertyDetails.purchasePrice]);

  const maxDepositAmount = useMemo(() => {
    const availableForDeposit = Math.max(propertyDetails.availableSavings - purchaseCosts.total, 0);
    return Math.min(availableForDeposit, propertyDetails.purchasePrice);
  }, [propertyDetails.purchasePrice, propertyDetails.availableSavings, purchaseCosts.total]);

  const depositPercentage = useMemo(() => {
    return (propertyDetails.depositAmount / propertyDetails.purchasePrice) * 100;
  }, [propertyDetails.depositAmount, propertyDetails.purchasePrice]);

  const totalUpfrontCosts = useMemo(() => {
    return propertyDetails.depositAmount + purchaseCosts.total;
  }, [propertyDetails.depositAmount, purchaseCosts.total]);

  const cashRemaining = useMemo(() => {
    return propertyDetails.availableSavings - totalUpfrontCosts;
  }, [propertyDetails.availableSavings, totalUpfrontCosts]);

  // Ensure deposit amount stays within bounds
  const handleDepositChange = (value: number[]) => {
    const newDeposit = Math.min(Math.max(value[0], minDepositAmount), maxDepositAmount);
    onDepositChange([newDeposit]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">Deposit Amount</Label>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-semibold text-slate-900">
            ${propertyDetails.depositAmount.toLocaleString()}
          </span>
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
          <h3 className="text-sm font-medium text-slate-700">Cost Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Purchase Costs</span>
              <span className="font-medium text-slate-900">${purchaseCosts.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Upfront</span>
              <span className="font-medium text-slate-900">${totalUpfrontCosts.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Cash Remaining</span>
                <span className={`font-medium ${cashRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${cashRemaining.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
