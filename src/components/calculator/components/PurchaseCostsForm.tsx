import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card } from '../../ui/card';
import { PurchaseCosts, AustralianState } from '../types';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import { cn } from '../../../lib/utils';
import { useEffect, useRef } from 'react';

interface PurchaseCostsFormProps {
  purchaseCosts: PurchaseCosts;
  onConveyancingFeeChange: (fee: number) => void;
  onBuildingAndPestFeeChange: (fee: number) => void;
  onStateChange: (state: AustralianState) => void;
  shouldFlash?: boolean;
}

export function PurchaseCostsForm({
  purchaseCosts,
  onConveyancingFeeChange,
  onBuildingAndPestFeeChange,
  onStateChange,
  shouldFlash = false
}: PurchaseCostsFormProps) {
  const toggleGroupRef = useRef<HTMLDivElement>(null);

  const states: { id: AustralianState; label: string }[] = [
    { id: 'NSW', label: 'NSW' },
    { id: 'VIC', label: 'VIC' },
    { id: 'QLD', label: 'QLD' },
    { id: 'SA', label: 'SA' },
    { id: 'WA', label: 'WA' },
    { id: 'TAS', label: 'TAS' },
    { id: 'NT', label: 'NT' },
    { id: 'ACT', label: 'ACT' },
  ];

  // Add flash effect only when shouldFlash is true
  useEffect(() => {
    if (shouldFlash && toggleGroupRef.current) {
      toggleGroupRef.current.classList.add('flash-highlight');
      setTimeout(() => {
        if (toggleGroupRef.current) {
          toggleGroupRef.current.classList.remove('flash-highlight');
        }
      }, 2000);
    }
  }, [shouldFlash]);

  return (
    <>
      <style>
        {`
          @keyframes flash {
            0% { background-color: transparent; }
            50% { background-color: rgba(59, 130, 246, 0.1); }
            100% { background-color: transparent; }
          }
          .flash-highlight {
            animation: flash 2s ease-out;
          }
        `}
      </style>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Purchase Costs</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>State</Label>
            <div ref={toggleGroupRef}>
              <ToggleGroup 
                type="single" 
                value={purchaseCosts.state}
                onValueChange={(value) => value && onStateChange(value as AustralianState)}
                className={cn(
                  "flex flex-wrap gap-2",
                  "transition-all duration-200"
                )}
              >
                {states.map((state) => (
                  <ToggleGroupItem
                    key={state.id}
                    value={state.id}
                    aria-label={`Select ${state.label}`}
                    className={cn(
                      "px-3 py-1",
                      "transition-all duration-200",
                      "data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900",
                      "hover:bg-slate-100"
                    )}
                  >
                    {state.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <p className="text-xs text-gray-500">
              Select state to calculate appropriate stamp duty and other state-specific costs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conveyancingFee">Conveyancing Fee ($)</Label>
              <Input
                id="conveyancingFee"
                type="number"
                value={purchaseCosts.conveyancingFee}
                onChange={(e) => onConveyancingFeeChange(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildingAndPestFee">Building & Pest Inspection ($)</Label>
              <Input
                id="buildingAndPestFee"
                type="number"
                value={purchaseCosts.buildingAndPestFee}
                onChange={(e) => onBuildingAndPestFeeChange(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transferFee">Transfer Fee ($)</Label>
              <Input
                id="transferFee"
                type="number"
                value={purchaseCosts.transferFee}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stampDuty">Stamp Duty ($)</Label>
              <Input
                id="stampDuty"
                type="number"
                value={purchaseCosts.stampDuty}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mortgageRegistrationFee">Mortgage Registration Fee ($)</Label>
              <Input
                id="mortgageRegistrationFee"
                type="number"
                value={purchaseCosts.mortgageRegistrationFee}
                disabled
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="totalPurchaseCosts">Total Purchase Costs ($)</Label>
              <Input
                id="totalPurchaseCosts"
                type="number"
                value={purchaseCosts.total}
                disabled
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
