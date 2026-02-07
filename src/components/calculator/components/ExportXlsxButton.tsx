import { useState } from 'react';
import { CalculationResults, CostStructure, MarketData, PropertyDetails, AustralianState } from '../types';

interface ExportXlsxButtonProps {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  costStructure: CostStructure;
  calculationResults: CalculationResults;
  state: AustralianState;
  scenarioName?: string;
}

const formatScenarioName = (name?: string) =>
  (name && name.trim().length > 0 ? name.trim() : 'current-model')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function ExportXlsxButton({
  propertyDetails,
  marketData,
  costStructure,
  calculationResults,
  state,
  scenarioName,
}: ExportXlsxButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();
      const timestamp = new Date();
      const summaryRows = [
      { Field: 'Exported At', Value: timestamp.toISOString() },
      { Field: 'Scenario', Value: scenarioName || 'Current model' },
      { Field: 'State', Value: state },
      { Field: 'Use Case', Value: propertyDetails.isPPOR ? 'PPOR' : 'Investment' },
      { Field: 'Purchase Price', Value: propertyDetails.purchasePrice },
      { Field: 'Deposit Amount', Value: propertyDetails.depositAmount },
      { Field: 'Available Savings', Value: propertyDetails.availableSavings },
      { Field: 'Loan Type', Value: propertyDetails.loanType },
      { Field: 'Interest Rate (%)', Value: propertyDetails.interestRate },
      { Field: 'Loan Term (years)', Value: propertyDetails.loanTerm },
      {
        Field: 'Interest Rate Changes',
        Value: propertyDetails.interestRateChanges?.length
          ? propertyDetails.interestRateChanges
              .map((change) => `Year ${change.year}: ${change.rate}%`)
              .join(' | ')
          : 'None',
      },
      {
        Field: 'Offset Mode',
        Value: propertyDetails.manualOffsetAmount !== undefined ? 'Manual' : 'Auto',
      },
      { Field: 'Offset Amount', Value: calculationResults.offsetAmount },
      {
        Field: 'Offset Contribution',
        Value: `${propertyDetails.offsetContribution.amount} / ${propertyDetails.offsetContribution.frequency}`,
      },
      { Field: 'Property Growth Rate (%)', Value: marketData.propertyGrowthRate },
      { Field: 'Rent Growth Rate (%)', Value: marketData.rentIncreaseRate },
      {
        Field: 'Operating Expense Growth Rate (%)',
        Value: marketData.operatingExpensesGrowthRate,
      },
      {
        Field: 'Property Value Corrections',
        Value: marketData.propertyValueCorrections?.length
          ? marketData.propertyValueCorrections
              .map((item) => `Year ${item.year}: ${item.change}%`)
              .join(' | ')
          : 'None',
      },
      { Field: 'Management Fee Type', Value: propertyDetails.managementFee.type },
      { Field: 'Management Fee Value', Value: propertyDetails.managementFee.value },
      { Field: 'Taxable Income Baseline', Value: propertyDetails.taxableIncome },
      { Field: 'CGT Exempt', Value: propertyDetails.isCGTExempt ? 'Yes' : 'No' },
      { Field: 'Custom CGT Discount', Value: propertyDetails.useCustomCGTDiscount ? 'Yes' : 'No' },
      { Field: 'CGT Discount Rate', Value: propertyDetails.cgtDiscountRate },
      { Field: 'No Negative Gearing', Value: propertyDetails.noNegativeGearing ? 'Yes' : 'No' },
      {
        Field: 'No Negative Gearing Start Year',
        Value: propertyDetails.noNegativeGearingStartYear,
      },
      { Field: 'Conveyancing Fee', Value: costStructure.purchaseCosts.conveyancingFee },
      { Field: 'Building & Pest Fee', Value: costStructure.purchaseCosts.buildingAndPestFee },
      { Field: 'Transfer Fee', Value: costStructure.purchaseCosts.transferFee },
      { Field: 'Stamp Duty', Value: costStructure.purchaseCosts.stampDuty },
      { Field: 'Mortgage Registration Fee', Value: costStructure.purchaseCosts.mortgageRegistrationFee },
      { Field: 'Total Purchase Costs', Value: costStructure.purchaseCosts.total },
      { Field: 'Water Cost', Value: costStructure.waterCost },
      { Field: 'Rates Cost', Value: costStructure.ratesCost },
      { Field: 'Insurance Cost', Value: costStructure.insuranceCost },
      { Field: 'Maintenance Percentage', Value: costStructure.maintenancePercentage },
      { Field: 'Future Sell Costs Percentage', Value: costStructure.futureSellCostsPercentage },
      { Field: 'Total Interest Saved', Value: calculationResults.totalInterestSaved },
      { Field: 'Years Reduced From Loan', Value: calculationResults.yearsReducedFromLoan },
      { Field: 'Months Reduced From Loan', Value: calculationResults.monthsReducedFromLoan },
      { Field: 'Final CGT Payable', Value: calculationResults.finalCGTPayable },
      { Field: 'Net Position At End', Value: calculationResults.netPositionAtEnd },
      { Field: 'Average ROI', Value: calculationResults.averageROI },
    ];

      const projectionsRows = calculationResults.yearlyProjections.map((row) => ({ ...row }));
      const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
      const projectionsSheet = XLSX.utils.json_to_sheet(projectionsRows);
      summarySheet['!cols'] = [{ wch: 34 }, { wch: 60 }];
      projectionsSheet['!cols'] = Object.keys(projectionsRows[0] || { year: 0 }).map(() => ({ wch: 16 }));

      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      XLSX.utils.book_append_sheet(workbook, projectionsSheet, 'Yearly Projections');

      const safeScenarioName = formatScenarioName(scenarioName);
      const fileDate = timestamp.toISOString().slice(0, 10);
      XLSX.writeFile(workbook, `ipcalc-${safeScenarioName}-${fileDate}.xlsx`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 bg-gradient-to-b from-emerald-50 to-emerald-100 px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium text-emerald-800 border border-emerald-200 rounded-lg shadow-sm hover:from-emerald-100 hover:to-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
      type="button"
      disabled={isExporting}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 16V4m0 12l-4-4m4 4l4-4M4 20h16"
        />
      </svg>
      {isExporting ? 'Preparing...' : 'Export XLSX'}
    </button>
  );
}
