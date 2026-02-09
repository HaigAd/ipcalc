import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { AustralianState, PropertyDetails, PurchaseCosts } from '../types';

interface PPORBenefitsPanelProps {
  state: AustralianState;
  propertyDetails: PropertyDetails;
  purchaseCosts: PurchaseCosts;
  onPropertyDetailsChange: (next: PropertyDetails) => void;
}

export function PPORBenefitsPanel({
  state,
  propertyDetails,
  purchaseCosts,
  onPropertyDetailsChange,
}: PPORBenefitsPanelProps) {
  const grantPathwayCouldApply =
    propertyDetails.isPPOR &&
    propertyDetails.propertyPurchaseType === 'new' &&
    state !== 'ACT' &&
    (propertyDetails.homeBuyerType === 'first-home-buyer' || state === 'NT');

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 sm:p-5 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">PPOR Benefits</h3>
        <p className="text-xs text-slate-600">
          Calculated values for {state} only.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Buyer profile</Label>
          <Select
            value={propertyDetails.homeBuyerType}
            onValueChange={(value) =>
              onPropertyDetailsChange({
                ...propertyDetails,
                homeBuyerType: value as PropertyDetails['homeBuyerType'],
              })
            }
          >
            <SelectTrigger className="h-11 border-slate-200 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first-home-buyer">First home buyer</SelectItem>
              <SelectItem value="non-first-home-buyer">Not a first home buyer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Property type</Label>
          <Select
            value={propertyDetails.propertyPurchaseType}
            onValueChange={(value) =>
              onPropertyDetailsChange({
                ...propertyDetails,
                propertyPurchaseType: value as PropertyDetails['propertyPurchaseType'],
              })
            }
          >
            <SelectTrigger className="h-11 border-slate-200 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="established">Established home</SelectItem>
              <SelectItem value="new">New home/build</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {grantPathwayCouldApply && (
        <div className="rounded-lg border border-blue-200 bg-white p-3 space-y-3">
          <p className="text-xs font-medium text-slate-700">Grant precision controls</p>
          <div className="flex items-center justify-between">
            <Label htmlFor="grant-age-18" className="text-xs text-slate-600">
              Applicant is 18+ years old
            </Label>
            <Switch
              id="grant-age-18"
              checked={propertyDetails.grantApplicantAge18OrOver}
              onCheckedChange={(checked) =>
                onPropertyDetailsChange({
                  ...propertyDetails,
                  grantApplicantAge18OrOver: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="grant-citizen-pr" className="text-xs text-slate-600">
              Applicant is citizen or permanent resident
            </Label>
            <Switch
              id="grant-citizen-pr"
              checked={propertyDetails.grantApplicantCitizenOrPR}
              onCheckedChange={(checked) =>
                onPropertyDetailsChange({
                  ...propertyDetails,
                  grantApplicantCitizenOrPR: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="grant-occupy" className="text-xs text-slate-600">
              Applicant will occupy the property
            </Label>
            <Switch
              id="grant-occupy"
              checked={propertyDetails.grantWillOccupyProperty}
              onCheckedChange={(checked) =>
                onPropertyDetailsChange({
                  ...propertyDetails,
                  grantWillOccupyProperty: checked,
                })
              }
            />
          </div>
        </div>
      )}

      {purchaseCosts.netPurchaseCostBenefits > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <p className="text-[11px] text-slate-500">Stamp duty concession</p>
            <p className="text-sm font-semibold text-slate-900">
              ${Math.round(purchaseCosts.stampDutyConcession).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <p className="text-[11px] text-slate-500">Estimated grant</p>
            <p className="text-sm font-semibold text-slate-900">
              ${Math.round(purchaseCosts.homeBuyerGrant).toLocaleString()}
            </p>
            {purchaseCosts.homeBuyerGrantProgram && (
              <p className="text-[11px] text-slate-500 mt-1">{purchaseCosts.homeBuyerGrantProgram}</p>
            )}
          </div>
          <div className="rounded-lg border border-blue-200 bg-white p-3">
            <p className="text-[11px] text-slate-500">Total estimated benefit</p>
            <p className="text-sm font-semibold text-slate-900">
              ${Math.round(purchaseCosts.netPurchaseCostBenefits).toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-blue-200 bg-white p-3">
          <p className="text-xs text-slate-600">
            {purchaseCosts.homeBuyerGrantBlockedByPrecisionInputs
              ? 'Grant not applied because one or more required grant precision controls are off.'
              : 'No calculated PPOR concession or grant for current inputs.'}
          </p>
        </div>
      )}
    </div>
  );
}
