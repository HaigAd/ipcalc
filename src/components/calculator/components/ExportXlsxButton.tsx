import { useState } from 'react';
import { saveAs } from 'file-saver';
import type ExcelJS from 'exceljs';
import { CalculationResults, CostStructure, MarketData, PropertyDetails, AustralianState } from '../types';

interface ExportXlsxButtonProps {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  costStructure: CostStructure;
  calculationResults: CalculationResults;
  state: AustralianState;
  scenarioName?: string;
}

interface ProjectionColumn {
  key: keyof CalculationResults['yearlyProjections'][number];
  header: string;
  width: number;
  numFmt?: string;
}

const formatScenarioName = (name?: string) =>
  (name && name.trim().length > 0 ? name.trim() : 'current-model')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const createChartImage = (
  yearlyProjections: CalculationResults['yearlyProjections']
): string | null => {
  if (typeof document === 'undefined' || yearlyProjections.length === 0) {
    return null;
  }

  const points = yearlyProjections.filter((row) => row.year > 0);
  if (!points.length) return null;

  const canvas = document.createElement('canvas');
  const width = 1100;
  const height = 500;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const padding = { top: 60, right: 60, bottom: 70, left: 90 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const years = points.map((point) => point.year);
  const values = points.map((point) => point.netPosition);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 0);
  const range = maxValue - minValue || 1;

  const x = (year: number) =>
    padding.left + ((year - minYear) / Math.max(1, maxYear - minYear)) * plotWidth;
  const y = (value: number) =>
    padding.top + (1 - (value - minValue) / range) * plotHeight;

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px Arial';
  ctx.fillText('Scenario Net Position Over Time', padding.left, 30);
  ctx.fillStyle = '#475569';
  ctx.font = '14px Arial';
  ctx.fillText('Generated from current assumptions and yearly projections', padding.left, 50);

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  const gridLines = 6;
  for (let i = 0; i <= gridLines; i++) {
    const yPos = padding.top + (i / gridLines) * plotHeight;
    ctx.beginPath();
    ctx.moveTo(padding.left, yPos);
    ctx.lineTo(width - padding.right, yPos);
    ctx.stroke();

    const value = maxValue - (i / gridLines) * range;
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.fillText(`$${Math.round(value).toLocaleString()}`, 10, yPos + 4);
  }

  const zeroY = y(0);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding.left, zeroY);
  ctx.lineTo(width - padding.right, zeroY);
  ctx.stroke();

  ctx.strokeStyle = '#0ea5e9';
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((point, index) => {
    const px = x(point.year);
    const py = y(point.netPosition);
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();

  ctx.fillStyle = '#0284c7';
  points.forEach((point, index) => {
    if (index % Math.max(1, Math.floor(points.length / 6)) !== 0 && index !== points.length - 1) {
      return;
    }
    const px = x(point.year);
    const py = y(point.netPosition);
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.font = '12px Arial';
    ctx.fillText(`Y${point.year}`, px - 10, height - padding.bottom + 22);
    ctx.fillStyle = '#0284c7';
  });

  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.stroke();

  ctx.fillStyle = '#334155';
  ctx.font = '13px Arial';
  ctx.fillText('Year', width / 2, height - 20);
  ctx.save();
  ctx.translate(24, height / 2 + 20);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Net Position ($)', 0, 0);
  ctx.restore();

  return canvas.toDataURL('image/png');
};

const applyHeaderStyle = (row: ExcelJS.Row) => {
  row.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  row.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E3A8A' },
  };
  row.alignment = { vertical: 'middle', horizontal: 'center' };
  row.height = 22;
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
      const ExcelJSModule = await import('exceljs');
      const Excel = ExcelJSModule.default;
      const workbook = new Excel.Workbook();
      const timestamp = new Date();

      workbook.creator = 'IPCalc';
      workbook.created = timestamp;
      workbook.modified = timestamp;

      const summarySheet = workbook.addWorksheet('Summary', {
        views: [{ showGridLines: false }],
      });
      summarySheet.columns = [{ width: 36 }, { width: 52 }];

      summarySheet.mergeCells('A1:B1');
      const titleCell = summarySheet.getCell('A1');
      titleCell.value = 'IPCalc Scenario Model Export';
      titleCell.font = { name: 'Calibri', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0F172A' },
      };
      titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
      summarySheet.getRow(1).height = 28;

      summarySheet.mergeCells('A2:B2');
      summarySheet.getCell('A2').value = `Scenario: ${scenarioName || 'Current model'} · Exported ${timestamp.toLocaleString()}`;
      summarySheet.getCell('A2').font = { name: 'Calibri', size: 11, color: { argb: 'FF334155' } };

      let rowPointer = 4;
      const addSection = (label: string, rows: Array<[string, string | number]>) => {
        summarySheet.mergeCells(`A${rowPointer}:B${rowPointer}`);
        const sectionCell = summarySheet.getCell(`A${rowPointer}`);
        sectionCell.value = label;
        sectionCell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FF0F172A' } };
        sectionCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE2E8F0' },
        };
        rowPointer += 1;

        rows.forEach(([field, value], index) => {
          const row = summarySheet.getRow(rowPointer);
          row.getCell(1).value = field;
          row.getCell(2).value = value;

          row.getCell(1).font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF334155' } };
          row.getCell(2).font = { name: 'Calibri', size: 11, color: { argb: 'FF0F172A' } };

          const bg = index % 2 === 0 ? 'FFF8FAFC' : 'FFFFFFFF';
          row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
          row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };

          row.getCell(1).border = {
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          };
          row.getCell(2).border = {
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          };

          if (typeof value === 'number' && /rate|percentage|discount|roi/i.test(field)) {
            row.getCell(2).numFmt = '0.00';
          } else if (typeof value === 'number' && !/year|month/i.test(field)) {
            row.getCell(2).numFmt = '$#,##0';
          }

          rowPointer += 1;
        });

        rowPointer += 1;
      };

      addSection('General', [
        ['State', state],
        ['Use Case', propertyDetails.isPPOR ? 'PPOR' : 'Investment'],
        ['Purchase Price', propertyDetails.purchasePrice],
        ['Deposit Amount', propertyDetails.depositAmount],
        ['Available Savings', propertyDetails.availableSavings],
      ]);

      addSection('Loan & Offset', [
        ['Loan Type', propertyDetails.loanType],
        ['Interest Rate (%)', propertyDetails.interestRate],
        ['Loan Term (years)', propertyDetails.loanTerm],
        [
          'Interest Rate Changes',
          propertyDetails.interestRateChanges?.length
            ? propertyDetails.interestRateChanges.map((change) => `Year ${change.year}: ${change.rate}%`).join(' | ')
            : 'None',
        ],
        ['Offset Mode', propertyDetails.manualOffsetAmount !== undefined ? 'Manual' : 'Auto'],
        ['Offset Amount', calculationResults.offsetAmount],
        ['Offset Contribution', `${propertyDetails.offsetContribution.amount} / ${propertyDetails.offsetContribution.frequency}`],
      ]);

      addSection('Market & Policy', [
        ['Property Growth Rate (%)', marketData.propertyGrowthRate],
        ['Rent Growth Rate (%)', marketData.rentIncreaseRate],
        ['Operating Expense Growth Rate (%)', marketData.operatingExpensesGrowthRate],
        ['Taxable Income Baseline', propertyDetails.taxableIncome],
        ['CGT Exempt', propertyDetails.isCGTExempt ? 'Yes' : 'No'],
        ['Custom CGT Discount', propertyDetails.useCustomCGTDiscount ? 'Yes' : 'No'],
        ['CGT Discount Rate', propertyDetails.cgtDiscountRate],
        ['No Negative Gearing', propertyDetails.noNegativeGearing ? 'Yes' : 'No'],
        ['No Negative Gearing Start Year', propertyDetails.noNegativeGearingStartYear],
      ]);

      addSection('Cost Assumptions', [
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
      ]);

      addSection('Outputs', [
        ['Total Interest Saved', calculationResults.totalInterestSaved],
        ['Years Reduced From Loan', calculationResults.yearsReducedFromLoan],
        ['Months Reduced From Loan', calculationResults.monthsReducedFromLoan],
        ['Final CGT Payable', calculationResults.finalCGTPayable],
        ['Final Net Position', calculationResults.netPositionAtEnd],
        ['Average ROI', calculationResults.averageROI],
      ]);

      const projectionColumns: ProjectionColumn[] = [
        { key: 'year', header: 'Year', width: 8 },
        { key: 'propertyValue', header: 'Property Value', width: 16, numFmt: '$#,##0' },
        { key: 'loanBalance', header: 'Loan Balance', width: 16, numFmt: '$#,##0' },
        { key: 'effectiveLoanBalance', header: 'Effective Loan', width: 16, numFmt: '$#,##0' },
        { key: 'rentalIncome', header: 'Rental Income', width: 14, numFmt: '$#,##0' },
        { key: 'rentSavings', header: 'Rent Savings', width: 14, numFmt: '$#,##0' },
        { key: 'yearlyInterestPaid', header: 'Interest Paid', width: 14, numFmt: '$#,##0' },
        { key: 'yearlyPrincipalPaid', header: 'Principal Paid', width: 14, numFmt: '$#,##0' },
        { key: 'yearlyExpenses', header: 'Expenses', width: 14, numFmt: '$#,##0' },
        { key: 'taxBenefit', header: 'Tax Benefit', width: 14, numFmt: '$#,##0' },
        { key: 'cashFlow', header: 'Cash Flow', width: 14, numFmt: '$#,##0' },
        { key: 'equity', header: 'Equity', width: 14, numFmt: '$#,##0' },
        { key: 'netPosition', header: 'Net Position', width: 14, numFmt: '$#,##0' },
        { key: 'cgtPayable', header: 'CGT Payable', width: 14, numFmt: '$#,##0' },
        { key: 'roi', header: 'ROI %', width: 10, numFmt: '0.00' },
      ];

      const projectionSheet = workbook.addWorksheet('Yearly Projections', {
        views: [{ state: 'frozen', ySplit: 1 }],
      });

      projectionSheet.columns = projectionColumns.map((column) => ({
        header: column.header,
        key: column.key,
        width: column.width,
      }));

      applyHeaderStyle(projectionSheet.getRow(1));
      projectionSheet.autoFilter = {
        from: 'A1',
        to: String.fromCharCode(64 + projectionColumns.length) + '1',
      };

      calculationResults.yearlyProjections.forEach((rowData, index) => {
        const row = projectionSheet.addRow(
          Object.fromEntries(projectionColumns.map((column) => [column.key, rowData[column.key]]))
        );

        row.font = { name: 'Calibri', size: 10, color: { argb: 'FF1E293B' } };
        row.eachCell((cell, cellNumber) => {
          const baseFill = index % 2 === 0 ? 'FFF8FAFC' : 'FFFFFFFF';
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: baseFill } };
          cell.border = {
            bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          };

          const column = projectionColumns[cellNumber - 1];
          if (column?.numFmt) {
            cell.numFmt = column.numFmt;
          }

          if (cellNumber === 1) {
            cell.alignment = { horizontal: 'center' };
          }
        });
      });

      const chartDataUrl = createChartImage(calculationResults.yearlyProjections);
      if (chartDataUrl) {
        const chartSheet = workbook.addWorksheet('Scenario Chart', {
          views: [{ showGridLines: false }],
        });
        chartSheet.columns = [{ width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }];

        chartSheet.mergeCells('A1:E1');
        chartSheet.getCell('A1').value = `Scenario Chart · ${scenarioLabel}`;
        chartSheet.getCell('A1').font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        chartSheet.getCell('A1').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0F172A' },
        };
        chartSheet.getRow(1).height = 28;

        chartSheet.mergeCells('A2:E2');
        chartSheet.getCell('A2').value = 'Net Position by Year (from yearly projection model)';
        chartSheet.getCell('A2').font = { name: 'Calibri', size: 11, color: { argb: 'FF334155' } };

        const imageId = workbook.addImage({
          base64: chartDataUrl,
          extension: 'png',
        });

        chartSheet.addImage(imageId, {
          tl: { col: 0, row: 3 },
          ext: { width: 1000, height: 430 },
        });
      }

      const safeScenarioName = formatScenarioName(scenarioName);
      const fileDate = timestamp.toISOString().slice(0, 10);
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, `ipcalc-${safeScenarioName}-${fileDate}.xlsx`);
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
