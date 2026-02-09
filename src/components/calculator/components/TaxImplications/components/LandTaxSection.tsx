import { Label } from '../../../../ui/label';
import { Switch } from '../../../../ui/switch';
import { Input } from '../../../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select';
import { AustralianState, PropertyDetails } from '../../../types';
import { LAND_TAX_RULES_AS_AT } from '../../../calculations/landTax';

interface LandTaxSectionProps {
  state: AustralianState;
  propertyDetails: PropertyDetails;
  propertyGrowthRate: number;
  estimatedLandTax: number;
  landValueUsed: number;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
}

export function LandTaxSection({
  state,
  propertyDetails,
  propertyGrowthRate,
  estimatedLandTax,
  landValueUsed,
  onPropertyDetailsChange,
}: LandTaxSectionProps) {
  const isManual = propertyDetails.landTaxCalculationMode === 'manual';
  const safeEstimatedLandTax = Number.isFinite(estimatedLandTax) ? estimatedLandTax : 0;
  const safeLandValueUsed = Number.isFinite(landValueUsed) ? landValueUsed : 0;

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">Include Land Tax</p>
          <p className="text-xs text-slate-500">State: {state}. Calculated from land value, not property value.</p>
          <p className="text-xs text-slate-500">Rates table as at {LAND_TAX_RULES_AS_AT}.</p>
        </div>
        <Switch
          id="include-land-tax"
          checked={propertyDetails.includeLandTax}
          onCheckedChange={(checked) =>
            onPropertyDetailsChange({
              ...propertyDetails,
              includeLandTax: checked,
            })
          }
        />
      </div>

      {propertyDetails.includeLandTax && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-slate-600">Calculation mode</Label>
            <Select
              value={propertyDetails.landTaxCalculationMode}
              onValueChange={(value) =>
                onPropertyDetailsChange({
                  ...propertyDetails,
                  landTaxCalculationMode: value as PropertyDetails['landTaxCalculationMode'],
                })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (state estimate)</SelectItem>
                <SelectItem value="manual">Manual amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isManual && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-slate-600">Land value growth mode</Label>
                <Select
                  value={propertyDetails.landValueGrowthMode}
                  onValueChange={(value) =>
                    onPropertyDetailsChange({
                      ...propertyDetails,
                      landValueGrowthMode: value as PropertyDetails['landValueGrowthMode'],
                    })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property-growth-rate">Use property growth rate</SelectItem>
                    <SelectItem value="custom-rate">Use custom growth rate</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">
                  Current property growth rate: {propertyGrowthRate.toFixed(2)}%
                </p>
              </div>

              {propertyDetails.landValueGrowthMode === 'custom-rate' && (
                <div className="space-y-2">
                  <Label htmlFor="custom-land-growth-rate" className="text-sm text-slate-600">
                    Custom land value growth rate (%)
                  </Label>
                  <Input
                    id="custom-land-growth-rate"
                    type="number"
                    step="0.1"
                    value={propertyDetails.customLandValueGrowthRate}
                    onChange={(e) =>
                      onPropertyDetailsChange({
                        ...propertyDetails,
                        customLandValueGrowthRate: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="land-value" className="text-sm text-slate-600">
              Land value ($)
            </Label>
            <Input
              id="land-value"
              type="number"
              value={propertyDetails.landValue}
              onChange={(e) =>
                onPropertyDetailsChange({
                  ...propertyDetails,
                  landValue: Math.max(0, Number(e.target.value)),
                })
              }
            />
          </div>

          {isManual && (
            <div className="space-y-2">
              <Label htmlFor="manual-land-tax" className="text-sm text-slate-600">
                Manual annual land tax ($)
              </Label>
              <Input
                id="manual-land-tax"
                type="number"
                value={propertyDetails.manualLandTaxAmount}
                onChange={(e) =>
                  onPropertyDetailsChange({
                    ...propertyDetails,
                    manualLandTaxAmount: Math.max(0, Number(e.target.value)),
                  })
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="other-taxable-land-value" className="text-sm text-slate-600">
              Other taxable land value ($)
            </Label>
            <Input
              id="other-taxable-land-value"
              type="number"
              value={propertyDetails.otherTaxableLandValue}
              onChange={(e) =>
                onPropertyDetailsChange({
                  ...propertyDetails,
                  otherTaxableLandValue: Math.max(0, Number(e.target.value)),
                })
              }
            />
            <p className="text-xs text-slate-500">
              Used to model threshold and marginal land-tax impact where assessments aggregate holdings.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-500">
              Estimated annual land tax ({isManual ? 'manual' : 'auto'})
            </p>
            <p className="text-base font-semibold text-slate-900">
              ${Math.round(safeEstimatedLandTax).toLocaleString()}
            </p>
            {!isManual && (
              <p className="text-xs text-slate-500 mt-1">
                Based on land value ${Math.round(safeLandValueUsed).toLocaleString()}.
              </p>
            )}
            {!isManual && safeLandValueUsed <= 0 && (
              <p className="text-xs text-amber-700 mt-1">
                Enter land value to estimate land tax.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
