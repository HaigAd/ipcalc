import { CalculationResults, PropertyDetails, CostStructure } from '../../types';
import { ReactNode } from 'react';

export interface ColumnDef {
  id: string;
  header: string;
  tooltip: string;
  group: string;
  render: (projection: CalculationResults['yearlyProjections'][0]) => ReactNode;
}

export const getColumns = (
  propertyDetails: PropertyDetails,
  costStructure: CostStructure
): ColumnDef[] => {
  const isPPOR = propertyDetails.isPPOR;
  const initialInvestment = propertyDetails.depositAmount + costStructure.purchaseCosts.total;

  return [
  {
    id: 'year',
    header: 'Year',
    tooltip: 'Year of projection',
    group: 'Basic Info',
    render: (projection) => projection.year
  },
  {
    id: 'propertyValue',
    header: 'Property Value',
    tooltip: 'Estimated property value after appreciation',
    group: 'Basic Info',
    render: (projection) => `$${Math.round(projection.propertyValue).toLocaleString()}`
  },
  {
    id: 'rentalIncome',
    header: isPPOR ? 'Rent Savings' : 'Rental Income',
    tooltip: isPPOR
      ? 'Estimated annual rent saved by living in the property'
      : 'Annual rental income after rent increases',
    group: 'Income',
    render: (projection) => (
      <span className="text-green-600">
        ${Math.round(isPPOR ? projection.rentSavings : projection.rentalIncome).toLocaleString()}
      </span>
    )
  },
  {
    id: 'yearlyInterestPaid',
    header: 'Interest Expense',
    tooltip: 'Annual interest paid on the loan',
    group: 'Expenses',
    render: (projection) => (
      <span className="text-red-600">
        ${Math.round(projection.yearlyInterestPaid).toLocaleString()}
      </span>
    )
  },
  {
    id: 'yearlyPrincipalPaid',
    header: 'Principal Paid',
    tooltip: 'Annual principal paid on the loan',
    group: 'Loan Details',
    render: (projection) => (
      <span className="text-amber-700">
        ${Math.round(projection.yearlyPrincipalPaid).toLocaleString()}
      </span>
    )
  },
  {
    id: 'managementFees',
    header: 'Management Fees',
    tooltip: 'Property management fees',
    group: 'Expenses',
    render: (projection) => (
      <span className="text-red-600">
        ${Math.round(projection.managementFees).toLocaleString()}
      </span>
    )
  },
  {
    id: 'otherExpenses',
    header: 'Other Expenses',
    tooltip: 'Other expenses including maintenance, insurance, rates etc.',
    group: 'Expenses',
    render: (projection) => (
      <span className="text-red-600">
        ${Math.round(projection.yearlyExpenses - projection.yearlyInterestPaid - projection.managementFees).toLocaleString()}
      </span>
    )
  },
  {
    id: 'yearlyExpenses',
    header: 'Total Expenses',
    tooltip: 'All expenses including interest, management fees, maintenance etc.',
    group: 'Expenses',
    render: (projection) => (
      <span className="text-red-700">
        ${Math.round(projection.yearlyExpenses).toLocaleString()}
      </span>
    )
  },
  {
    id: 'cashFlow',
    header: isPPOR ? 'Cash Flow (Excl. Rent Savings)' : 'Cash Flow',
    tooltip: isPPOR
      ? 'Net cash position after expenses and tax benefits (rent savings excluded)'
      : 'Net cash position after all income, expenses and tax benefits',
    group: 'Financial Position',
    render: (projection) => (
      <span className={projection.cashFlow >= 0 ? 'text-green-700' : 'text-red-700'}>
        ${Math.round(projection.cashFlow).toLocaleString()}
      </span>
    )
  },
  {
    id: 'totalCashInvested',
    header: 'Total Cash Invested',
    tooltip: 'Deposit + purchase costs + cumulative principal + offset contributions',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-slate-700 font-medium">
        ${Math.round(
          initialInvestment +
          projection.cumulativePrincipalPaid +
          projection.cumulativeOffsetContributions
        ).toLocaleString()}
      </span>
    )
  },
  {
    id: 'saleProceeds',
    header: 'Sale Proceeds',
    tooltip: 'Net equity after CGT minus estimated sale costs',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-slate-700 font-medium">
        ${Math.round(
          projection.netEquityAfterCGT - (costStructure.futureSellCostsPercentage / 100) * projection.propertyValue
        ).toLocaleString()}
      </span>
    )
  },
  {
    id: 'taxBenefit',
    header: 'Tax Impact',
    tooltip: 'Tax impact (savings or cost) from property income/loss',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-blue-600">
        ${Math.round(projection.taxBenefit).toLocaleString()}
      </span>
    )
  },
  {
    id: 'quarantinedLosses',
    header: 'Quarantined Losses',
    tooltip: 'Cumulative quarantined losses available to offset future property income',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-amber-700">
        ${Math.round(projection.quarantinedLosses).toLocaleString()}
      </span>
    )
  },
  {
    id: 'quarantinedLossesUsed',
    header: 'Quarantined Losses Used',
    tooltip: 'Quarantined losses applied against property income this year',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-amber-700">
        ${Math.round(projection.quarantinedLossesUsed).toLocaleString()}
      </span>
    )
  },
  {
    id: 'cumulativeOperatingPosition',
    header: 'Cumulative Operating Position',
    tooltip: 'Total expenses minus total income and tax benefit to date',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-blue-600">
        ${Math.round(projection.cumulativeOperatingPosition).toLocaleString()}
      </span>
    )
  },
  {
    id: 'loanBalance',
    header: 'Loan Balance',
    tooltip: 'Remaining loan amount after offset benefits',
    group: 'Loan Details',
    render: (projection) => `$${Math.round(projection.effectiveLoanBalance).toLocaleString()}`
  },
  {
    id: 'yearlyOffsetContributions',
    header: 'Offset Contrib.',
    tooltip: 'Regular contributions made to offset account this year',
    group: 'Loan Details',
    render: (projection) => (
      <span className="text-blue-600">
        ${Math.round(projection.yearlyOffsetContributions).toLocaleString()}
      </span>
    )
  },
  {
    id: 'totalDepreciation',
    header: 'Depreciation',
    tooltip: 'Total depreciation benefits (capital works + plant and equipment)',
    group: 'Tax Benefits',
    render: (projection) => (
      <span className="text-blue-700">
        ${Math.round(projection.totalDepreciation).toLocaleString()}
      </span>
    )
  },
  {
    id: 'capitalGain',
    header: 'Capital Gain',
    tooltip: 'Increase in property value for this year',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-green-600">
        ${Math.round(projection.capitalGain).toLocaleString()}
      </span>
    )
  },
  {
    id: 'cgtPayable',
    header: 'CGT Payable',
    tooltip: 'Estimated CGT payable if sold this year (includes CGT discount for holdings over 12 months)',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-red-600">
        ${Math.round(projection.cgtPayable).toLocaleString()}
      </span>
    )
  },
  {
    id: 'equity',
    header: 'Gross Equity',
    tooltip: 'Property value minus loan balance (before CGT)',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-green-800 font-medium">
        ${Math.round(projection.equity).toLocaleString()}
      </span>
    )
  },
  {
    id: 'netEquityAfterCGT',
    header: 'Net Equity',
    tooltip: 'Property value minus loan balance and CGT payable',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-green-800 font-medium">
        ${Math.round(projection.netEquityAfterCGT).toLocaleString()}
      </span>
    )
  },
  {
    id: 'netPosition',
    header: 'Net Position (If Sold)',
    tooltip: 'Net position after sale costs, CGT, and cumulative cash flows',
    group: 'Financial Position',
    render: (projection) => (
      <span className={projection.netPosition >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
        ${Math.round(projection.netPosition).toLocaleString()}
      </span>
    )
  },
  {
    id: 'roi',
    header: 'ROI (Total Cash)',
    tooltip: 'ROI using total cash invested (includes principal contributions)',
    group: 'Financial Position',
    render: (projection) => (
      <span className={projection.roi >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
        {projection.roi.toFixed(1)}%
      </span>
    )
  },
  {
    id: 'roiInitialInvestment',
    header: 'ROI (Initial)',
    tooltip: 'ROI using initial investment only',
    group: 'Financial Position',
    render: (projection) => (
      <span className={projection.roiInitialInvestment >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
        {projection.roiInitialInvestment.toFixed(1)}%
      </span>
    )
  },
];
};
