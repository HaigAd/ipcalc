import { AustralianState, PropertyDetails } from '../../types';
import { useTaxCalculations } from './hooks/useTaxCalculations';
import { TaxableIncomeSection } from './components/TaxableIncomeSection';
import { DepreciationSection } from './components/DepreciationSection';
import { TaxBenefitsSummary } from './components/TaxBenefitsSummary';
import { CGTExemptionToggle } from './components/CGTExemptionToggle';
import { LandTaxSection } from './components/LandTaxSection';
import { getDepreciation } from '../../utils/depreciation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../ui/accordion';
import { Label } from '../../../ui/label';
import { Switch } from '../../../ui/switch';
import { Input } from '../../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../ui/tabs';
import { cn } from '../../../../lib/utils';
import { calculateEffectiveLandTax } from '../../calculations/landTax';

interface TaxImplicationsProps {
  state: AustralianState;
  propertyGrowthRate: number;
  yearlyProjections: {
    taxBenefit: number;
    taxableIncome: number;
    cgtPayable: number;
  }[];
  propertyDetails: PropertyDetails;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
}

export function TaxImplications({ 
  state,
  propertyGrowthRate,
  propertyDetails,
  yearlyProjections,
  onPropertyDetailsChange 
}: TaxImplicationsProps) {
  const firstYearProjection = yearlyProjections[1] ?? yearlyProjections[0];
  const firstYearCGTProjection = yearlyProjections[1] ?? yearlyProjections[0];

  const {
    inputValue,
    handleIncomeChange,
    handleBlur,
    handleFocus,
    handleCGTExemptionChange,
    handleCGTDiscountToggle,
    handleCGTDiscountRateChange,
    handleNoNegativeGearingToggle,
    handleNoNegativeGearingYearChange,
    calculations
  } = useTaxCalculations({
    propertyDetails,
    onPropertyDetailsChange,
    firstYearProjection
  });

  // Get first year depreciation values
  const firstYearDepreciation = getDepreciation(propertyDetails.depreciationSchedule, 1);
  const effectiveCGTDiscountRate = propertyDetails.useCustomCGTDiscount
    ? propertyDetails.cgtDiscountRate
    : 0.5;
  const effectiveCGTDiscountPercent = Number((effectiveCGTDiscountRate * 100).toFixed(1));
  const customCGTDiscountPercent = Number((propertyDetails.cgtDiscountRate * 100).toFixed(1)).toString();
  const negativeGearingStartYear = Math.max(1, Math.floor(propertyDetails.noNegativeGearingStartYear || 1));
  const isCGTExempt = propertyDetails.isPPOR || propertyDetails.isCGTExempt;
  const { amount: estimatedLandTax, landValueUsed } = calculateEffectiveLandTax(propertyDetails, state);

  return (
    <div className="space-y-4">
      {propertyDetails.isPPOR && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          PPOR selected: tax deductions and CGT don’t apply. These settings are shown for reference.
        </div>
      )}
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", propertyDetails.isPPOR && "opacity-60 pointer-events-none")}>
      {/* Left Column - Tax Details */}
      <div className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-6 pt-4">
            <TaxableIncomeSection
              inputValue={inputValue}
              onInputChange={handleIncomeChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              bracket={calculations.bracket}
              taxPayable={calculations.taxPayable}
            />

            <DepreciationSection
              schedule={propertyDetails.depreciationSchedule}
              onScheduleChange={(schedule) => 
                onPropertyDetailsChange({
                  ...propertyDetails,
                  depreciationSchedule: schedule
                })
              }
              loanTerm={propertyDetails.loanTerm}
              isPPOR={propertyDetails.isPPOR}
            />

            <CGTExemptionToggle
              isExempt={isCGTExempt}
              isPPOR={propertyDetails.isPPOR}
              discountPercent={effectiveCGTDiscountPercent}
              onToggle={handleCGTExemptionChange}
            />
          </TabsContent>
          <TabsContent value="advanced" className="space-y-6 pt-4">
            <LandTaxSection
              state={state}
              propertyDetails={propertyDetails}
              propertyGrowthRate={propertyGrowthRate}
              estimatedLandTax={estimatedLandTax}
              landValueUsed={landValueUsed}
              onPropertyDetailsChange={onPropertyDetailsChange}
            />

            <Accordion type="single" collapsible className="border-t border-slate-200 pt-4">
              <AccordionItem value="tax-advanced" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline" data-tutorial="tax-policy-trigger">
                  <div className="flex justify-between w-full">
                    <span className="text-sm font-medium text-slate-700">Tax Policy Modelling</span>
                    <span className="text-sm text-slate-500">
                      CGT {effectiveCGTDiscountPercent}%, loss quarantine {propertyDetails.noNegativeGearing ? `from year ${negativeGearingStartYear}` : 'off'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="custom-cgt-discount" className="text-sm font-medium text-slate-700">
                        Custom CGT Discount
                      </Label>
                      <Switch
                        id="custom-cgt-discount"
                        checked={propertyDetails.useCustomCGTDiscount}
                        onCheckedChange={handleCGTDiscountToggle}
                      />
                    </div>

                    {propertyDetails.useCustomCGTDiscount ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            id="custom-cgt-discount-rate"
                            type="number"
                            inputMode="decimal"
                            min="0"
                            max="100"
                            step="0.1"
                            value={customCGTDiscountPercent}
                            onChange={(e) => handleCGTDiscountRateChange(e.target.value)}
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                        </div>
                        <p className="text-sm text-slate-500">
                          Applies to gains held over 12 months.
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Uses the standard 50% CGT discount for holdings over 12 months.
                      </p>
                    )}

                    <div className="pt-4 border-t border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="no-negative-gearing" className="text-sm font-medium text-slate-700">
                          Quarantine Property Losses
                        </Label>
                        <Switch
                          id="no-negative-gearing"
                          checked={propertyDetails.noNegativeGearing}
                          onCheckedChange={handleNoNegativeGearingToggle}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="negative-gearing-start-year" className="text-sm text-slate-600">
                          Start year for loss quarantine
                        </Label>
                        <Input
                          id="negative-gearing-start-year"
                          type="number"
                          inputMode="numeric"
                          min="1"
                          max={propertyDetails.loanTerm}
                          step="1"
                          value={negativeGearingStartYear}
                          onChange={(e) => handleNoNegativeGearingYearChange(e.target.value)}
                          disabled={!propertyDetails.noNegativeGearing}
                        />
                        <p className="text-sm text-slate-500">
                          Losses from this year onward can only offset future property income.
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Column - Tax Benefits Summary */}
      <div>
        <TaxBenefitsSummary
          originalIncome={propertyDetails.taxableIncome}
          firstYearIncomeLoss={calculations.firstYearIncomeLoss}
          finalTaxableIncome={calculations.finalTaxableIncome}
          capitalWorksValue={firstYearDepreciation.capitalWorks}
          plantEquipmentValue={firstYearDepreciation.plantEquipment}
          totalDepreciation={calculations.totalDepreciation}
          taxBenefit={calculations.taxBenefit}
          monthlyBenefit={calculations.monthlyBenefit}
          firstYearCGT={firstYearCGTProjection?.cgtPayable ?? 0}
          isCGTExempt={isCGTExempt}
          isPPOR={propertyDetails.isPPOR}
          cgtDiscountPercent={effectiveCGTDiscountPercent}
        />
      </div>
      </div>
    </div>
  );
}
