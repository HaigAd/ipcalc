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

const columnLetter = (index: number) => {
  let dividend = index + 1;
  let columnName = '';
  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }
  return columnName;
};

export function ExportXlsxButton({
  propertyDetails,
  marketData,
  costStructure,
  calculationResults,
  state,
  scenarioName,
}: ExportXlsxButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const scenarioLabel = scenarioName?.trim() ? scenarioName.trim() : 'Current scenario';

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();
      const timestamp = new Date();
      const summaryRows: Array<[string, string | number]> = [
        ['Exported At', timestamp.toISOString()],
        ['Scenario', scenarioName || 'Current model'],
        ['State', state],
        ['Use Case', propertyDetails.isPPOR ? 'PPOR' : 'Investment'],
        ['Purchase Price', propertyDetails.purchasePrice],
        ['Deposit Amount', propertyDetails.depositAmount],
        ['Available Savings', propertyDetails.availableSavings],
        ['Loan Type', propertyDetails.loanType],
        ['Interest Rate (%)', propertyDetails.interestRate],
        ['Loan Term (years)', propertyDetails.loanTerm],
        [
          'Interest Rate Changes',
          propertyDetails.interestRateChanges?.length
            ? propertyDetails.interestRateChanges
                .map((change) => `Year ${change.year}: ${change.rate}%`)
                .join(' | ')
            : 'None',
        ],
        [
          'Offset Mode',
          propertyDetails.manualOffsetAmount !== undefined ? 'Manual' : 'Auto',
        ],
        ['Offset Amount', calculationResults.offsetAmount],
        [
          'Offset Contribution',
          `${propertyDetails.offsetContribution.amount} / ${propertyDetails.offsetContribution.frequency}`,
        ],
        ['Property Growth Rate (%)', marketData.propertyGrowthRate],
        ['Rent Growth Rate (%)', marketData.rentIncreaseRate],
        ['Operating Expense Growth Rate (%)', marketData.operatingExpensesGrowthRate],
        [
          'Property Value Corrections',
          marketData.propertyValueCorrections?.length
            ? marketData.propertyValueCorrections
                .map((item) => `Year ${item.year}: ${item.change}%`)
                .join(' | ')
            : 'None',
        ],
        ['Management Fee Type', propertyDetails.managementFee.type],
        ['Management Fee Value', propertyDetails.managementFee.value],
        ['Taxable Income Baseline', propertyDetails.taxableIncome],
        ['CGT Exempt', propertyDetails.isCGTExempt ? 'Yes' : 'No'],
        ['Custom CGT Discount', propertyDetails.useCustomCGTDiscount ? 'Yes' : 'No'],
        ['CGT Discount Rate', propertyDetails.cgtDiscountRate],
        ['No Negative Gearing', propertyDetails.noNegativeGearing ? 'Yes' : 'No'],
        ['No Negative Gearing Start Year', propertyDetails.noNegativeGearingStartYear],
        ['Conveyancing Fee', costStructure.purchaseCosts.conveyancingFee],
        ['Building & Pest Fee', costStructure.purchaseCosts.buildingAndPestFee],
        ['Transfer Fee', costStructure.purchaseCosts.transferFee],
        ['Stamp Duty', costStructure.purchaseCosts.stampDuty],
        ['Mortgage Registration Fee', costStructure.purchaseCosts.mortgageRegistrationFee],
        ['Total Purchase Costs', costStructure.purchaseCosts.total],
        ['Water Cost', costStructure.waterCost],
        ['Rates Cost', costStructure.ratesCost],
        ['Insurance Cost', costStructure.insuranceCost],
        ['Maintenance Percentage', costStructure.maintenancePercentage],
        ['Future Sell Costs Percentage', costStructure.futureSellCostsPercentage],
        ['Total Interest Saved', calculationResults.totalInterestSaved],
        ['Years Reduced From Loan', calculationResults.yearsReducedFromLoan],
        ['Months Reduced From Loan', calculationResults.monthsReducedFromLoan],
        ['Final CGT Payable', calculationResults.finalCGTPayable],
        ['Net Position At End', calculationResults.netPositionAtEnd],
        ['Average ROI', calculationResults.averageROI],
      ];

      const summaryAoa: (string | number)[][] = [
        ['IPCalc Scenario Export'],
        [''],
        ['General'],
        ...summaryRows.slice(0, 4),
        [''],
        ['Loan & Offset'],
        ...summaryRows.slice(4, 14),
        [''],
        ['Market & Tax'],
        ...summaryRows.slice(14, 26),
        [''],
        ['Costs & Outputs'],
        ...summaryRows.slice(26),
      ];

      const projectionColumns: Array<{
        key: keyof CalculationResults['yearlyProjections'][number];
        label: string;
        format?: string;
        width?: number;
      }> = [
        { key: 'year', label: 'Year', width: 8 },
        { key: 'propertyValue', label: 'Property Value', format: '$#,##0', width: 16 },
        { key: 'loanBalance', label: 'Loan Balance', format: '$#,##0', width: 16 },
        { key: 'effectiveLoanBalance', label: 'Effective Loan Balance', format: '$#,##0', width: 18 },
        { key: 'rentalIncome', label: 'Rental Income', format: '$#,##0', width: 14 },
        { key: 'rentSavings', label: 'Rent Savings', format: '$#,##0', width: 14 },
        { key: 'yearlyInterestPaid', label: 'Interest Paid', format: '$#,##0', width: 14 },
        { key: 'yearlyPrincipalPaid', label: 'Principal Paid', format: '$#,##0', width: 14 },
        { key: 'yearlyExpenses', label: 'Yearly Expenses', format: '$#,##0', width: 15 },
        { key: 'taxableIncome', label: 'Taxable Income', format: '$#,##0', width: 15 },
        { key: 'taxBenefit', label: 'Tax Benefit', format: '$#,##0', width: 14 },
        { key: 'quarantinedLosses', label: 'Quarantined Losses', format: '$#,##0', width: 18 },
        { key: 'quarantinedLossesUsed', label: 'Quarantined Used', format: '$#,##0', width: 17 },
        { key: 'cashFlow', label: 'Cash Flow', format: '$#,##0', width: 13 },
        { key: 'equity', label: 'Equity', format: '$#,##0', width: 14 },
        { key: 'netEquityAfterCGT', label: 'Net Equity After CGT', format: '$#,##0', width: 19 },
        { key: 'netPosition', label: 'Net Position', format: '$#,##0', width: 15 },
        { key: 'roi', label: 'ROI (%)', format: '0.00', width: 10 },
        { key: 'roiInitialInvestment', label: 'ROI Initial (%)', format: '0.00', width: 13 },
        { key: 'cgtPayable', label: 'CGT Payable', format: '$#,##0', width: 14 },
      ];

      const projectionsAoa: (string | number)[][] = [
        projectionColumns.map((column) => column.label),
        ...calculationResults.yearlyProjections.map((row) =>
          projectionColumns.map((column) => row[column.key] as number)
        ),
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryAoa);
      const projectionsSheet = XLSX.utils.aoa_to_sheet(projectionsAoa);

      summarySheet['!cols'] = [{ wch: 34 }, { wch: 60 }];
      projectionsSheet['!cols'] = projectionColumns.map((column) => ({ wch: column.width ?? 14 }));
      const lastProjectionColumn = columnLetter(projectionColumns.length - 1);
      const projectionRowCount = projectionsAoa.length;
      projectionsSheet['!autofilter'] = { ref: `A1:${lastProjectionColumn}1` };
      projectionsSheet['!freeze'] = { xSplit: 0, ySplit: 1 };

      for (let colIndex = 0; colIndex < projectionColumns.length; colIndex++) {
        const format = projectionColumns[colIndex].format;
        if (!format) continue;
        const col = columnLetter(colIndex);
        for (let rowIndex = 2; rowIndex <= projectionRowCount; rowIndex++) {
          const cellAddress = `${col}${rowIndex}`;
          const cell = projectionsSheet[cellAddress];
          if (cell && typeof cell.v === 'number') {
            cell.z = format;
          }
        }
      }

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
      title={`${scenarioLabel} -> XLSX`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 16V4m0 12l-4-4m4 4l4-4M4 20h16"
        />
      </svg>
      <span className="flex flex-col leading-tight text-left">
        <span>{isExporting ? 'Preparing...' : 'Export Scenario'}</span>
        <span className="text-[11px] font-normal text-emerald-700/80">
          {isExporting ? 'XLSX' : `XLSX · ${scenarioLabel}`}
        </span>
      </span>
    </button>
  );
}
