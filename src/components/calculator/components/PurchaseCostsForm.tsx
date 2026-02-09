import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card } from '../../ui/card';
import { PurchaseCosts, AustralianState, PropertyDetails } from '../types';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import { cn } from '../../../lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Switch } from '../../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface PurchaseCostsFormProps {
  purchaseCosts: PurchaseCosts;
  propertyDetails: PropertyDetails;
  setPropertyDetails: (details: PropertyDetails) => void;
  onConveyancingFeeChange: (fee: number) => void;
  onBuildingAndPestFeeChange: (fee: number) => void;
  onStateChange: (state: AustralianState) => void;
  shouldFlash?: boolean;
  shouldOpenDetails?: boolean;
}

export function PurchaseCostsForm({
  purchaseCosts,
  propertyDetails,
  setPropertyDetails,
  onConveyancingFeeChange,
  onBuildingAndPestFeeChange,
  onStateChange,
  shouldFlash = false,
  shouldOpenDetails = false
}: PurchaseCostsFormProps) {
  const toggleGroupRef = useRef<HTMLDivElement>(null);
  const [showBenefitsBreakdown, setShowBenefitsBreakdown] = useState(false);
  const [showDetailedCosts, setShowDetailedCosts] = useState(false);

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

  useEffect(() => {
    if (shouldOpenDetails) {
      setShowDetailedCosts(true);
    }
  }, [shouldOpenDetails]);

  const lmiTotal = purchaseCosts.lmi;
  const taxesAndFeesTotal =
    purchaseCosts.transferFee +
    purchaseCosts.stampDuty +
    purchaseCosts.mortgageRegistrationFee;
  const otherTotal =
    purchaseCosts.conveyancingFee +
    purchaseCosts.buildingAndPestFee -
    purchaseCosts.homeBuyerGrant;

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
            <div ref={toggleGroupRef} data-tutorial="purchase-state-selector">
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

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
            <div>
              <Label htmlFor="waiveLMI">Waive LMI</Label>
              <p className="text-xs text-slate-500">
                If enabled, lender's mortgage insurance is treated as waived.
              </p>
              <p className="text-xs text-slate-500">LMI is indicative only and lender-specific.</p>
            </div>
            <Switch
              id="waiveLMI"
              checked={propertyDetails.waiveLMI}
              onCheckedChange={(checked) =>
                setPropertyDetails({
                  ...propertyDetails,
                  waiveLMI: checked
                })
              }
            />
          </div>

          {!propertyDetails.waiveLMI && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-slate-200 p-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">LMI Calculation</Label>
                <Select
                  value={propertyDetails.lmiCalculationMode}
                  onValueChange={(value) =>
                    setPropertyDetails({
                      ...propertyDetails,
                      lmiCalculationMode: value as PropertyDetails['lmiCalculationMode']
                    })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (indicative)</SelectItem>
                    <SelectItem value="manual">Manual amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {propertyDetails.lmiCalculationMode === 'manual' && (
                <div className="space-y-2">
                  <Label htmlFor="manualLMIAmount">Custom LMI Amount ($)</Label>
                  <Input
                    id="manualLMIAmount"
                    type="number"
                    value={propertyDetails.manualLMIAmount}
                    onChange={(e) =>
                      setPropertyDetails({
                        ...propertyDetails,
                        manualLMIAmount: Math.max(0, Number(e.target.value))
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">LMI</p>
              <p className="text-base font-semibold text-slate-900">${Math.round(lmiTotal).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Taxes & Fees</p>
              <p className="text-base font-semibold text-slate-900">${Math.round(taxesAndFeesTotal).toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Other</p>
              <p className="text-base font-semibold text-slate-900">${Math.round(otherTotal).toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs text-slate-500">Total Purchase Costs</p>
            <p className="text-lg font-semibold text-slate-900">${Math.round(purchaseCosts.total).toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conveyancingFee">Conveyancing Fee ($)</Label>
              <Input
                id="conveyancingFee"
                data-tutorial="conveyancing-fee-input"
                type="number"
                value={purchaseCosts.conveyancingFee}
                onChange={(e) => onConveyancingFeeChange(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildingAndPestFee">Building & Pest Inspection ($)</Label>
              <Input
                id="buildingAndPestFee"
                data-tutorial="building-pest-fee-input"
                type="number"
                value={purchaseCosts.buildingAndPestFee}
                onChange={(e) => onBuildingAndPestFeeChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowDetailedCosts((prev) => !prev)}
              className="text-xs font-medium text-blue-700 hover:text-blue-800"
            >
              {showDetailedCosts ? 'Hide detailed line items' : 'Show detailed line items'}
            </button>
          </div>

          {showDetailedCosts && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="lmi">Lender's Mortgage Insurance (LMI) ($)</Label>
              <Input
                id="lmi"
                type="number"
                value={purchaseCosts.lmi}
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
            {purchaseCosts.netPurchaseCostBenefits > 0 && (
              <div className="space-y-2">
                <Label htmlFor="netPurchaseCostBenefits">Estimated Buyer Benefits ($)</Label>
                <Input id="netPurchaseCostBenefits" type="number" value={purchaseCosts.netPurchaseCostBenefits} disabled />
                <button
                  type="button"
                  onClick={() => setShowBenefitsBreakdown((prev) => !prev)}
                  className="text-xs font-medium text-blue-700 hover:text-blue-800"
                >
                  {showBenefitsBreakdown ? 'Hide benefit breakdown' : 'Show benefit breakdown'}
                </button>
              </div>
            )}
            {purchaseCosts.netPurchaseCostBenefits > 0 && showBenefitsBreakdown && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="stampDutyBeforeConcessions">Stamp Duty (Before Concessions) ($)</Label>
                  <Input
                    id="stampDutyBeforeConcessions"
                    type="number"
                    value={purchaseCosts.stampDutyBeforeConcessions}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stampDutyConcession">Stamp Duty Concession ($)</Label>
                  <Input
                    id="stampDutyConcession"
                    type="number"
                    value={purchaseCosts.stampDutyConcession}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeBuyerGrant">Estimated Home Buyer Grant ($)</Label>
                  <Input
                    id="homeBuyerGrant"
                    type="number"
                    value={purchaseCosts.homeBuyerGrant}
                    disabled
                  />
                </div>
              </>
            )}
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
          )}
        </div>
      </Card>
    </>
  );
}
