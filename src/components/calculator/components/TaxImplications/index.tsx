import { PropertyDetails } from '../../types';
import { useTaxCalculations } from './hooks/useTaxCalculations';
import { TaxableIncomeSection } from './components/TaxableIncomeSection';
import { DepreciationSection } from './components/DepreciationSection';
import { TaxBenefitsSummary } from './components/TaxBenefitsSummary';
import { CGTExemptionToggle } from './components/CGTExemptionToggle';

interface TaxImplicationsProps {
  yearlyProjections: {
    taxBenefit: number;
    taxableIncome: number;
    cgtPayable: number;
  }[];
  propertyDetails: PropertyDetails;
  onPropertyDetailsChange: (details: PropertyDetails) => void;
}

export function TaxImplications({ 
  propertyDetails,
  yearlyProjections,
  onPropertyDetailsChange 
}: TaxImplicationsProps) {
  const {
    inputValue,
    handleIncomeChange,
    handleBlur,
    handleFocus,
    handleDepreciationChange,
    handleCGTExemptionChange,
    calculations
  } = useTaxCalculations({
    propertyDetails,
    onPropertyDetailsChange,
    firstYearProjection: yearlyProjections[0]
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column - Tax Details */}
      <div className="space-y-6">
        <TaxableIncomeSection
          inputValue={inputValue}
          onInputChange={handleIncomeChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          bracket={calculations.bracket}
          taxPayable={calculations.taxPayable}
        />

        <DepreciationSection
          capitalWorksValue={propertyDetails.capitalWorksDepreciation}
          plantEquipmentValue={propertyDetails.plantEquipmentDepreciation}
          onCapitalWorksChange={(value) => handleDepreciationChange('capitalWorks', value)}
          onPlantEquipmentChange={(value) => handleDepreciationChange('plantEquipment', value)}
        />

        <CGTExemptionToggle
          isExempt={propertyDetails.isCGTExempt}
          onToggle={handleCGTExemptionChange}
        />
      </div>

      {/* Right Column - Tax Benefits Summary */}
      <div>
        <TaxBenefitsSummary
          originalIncome={propertyDetails.taxableIncome}
          firstYearIncomeLoss={calculations.firstYearIncomeLoss}
          finalTaxableIncome={calculations.finalTaxableIncome}
          capitalWorksValue={propertyDetails.capitalWorksDepreciation}
          plantEquipmentValue={propertyDetails.plantEquipmentDepreciation}
          totalDepreciation={calculations.totalDepreciation}
          taxBenefit={calculations.taxBenefit}
          monthlyBenefit={calculations.monthlyBenefit}
          firstYearCGT={yearlyProjections[0].cgtPayable}
          isCGTExempt={propertyDetails.isCGTExempt}
        />
      </div>
    </div>
  );
}
