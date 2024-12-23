import { CalculationResults, MarketData } from '../../types';

export interface ColumnDef {
  id: string;
  header: string;
  tooltip: string;
  group: string;
  render: (projection: CalculationResults['yearlyProjections'][0]) => React.ReactNode;
}

export const getColumns = (marketData: MarketData): ColumnDef[] => [
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
    header: 'Rental Income',
    tooltip: 'Annual rental income after rent increases',
    group: 'Income',
    render: (projection) => (
      <span className="text-green-600">
        ${Math.round(projection.rentalIncome).toLocaleString()}
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
    header: 'Cash Flow',
    tooltip: 'Net cash position after all income, expenses and tax benefits',
    group: 'Financial Position',
    render: (projection) => (
      <span className={projection.cashFlow >= 0 ? 'text-green-700' : 'text-red-700'}>
        ${Math.round(projection.cashFlow).toLocaleString()}
      </span>
    )
  },
  {
    id: 'taxBenefit',
    header: 'Tax Benefit',
    tooltip: 'Tax savings from negative gearing if applicable',
    group: 'Financial Position',
    render: (projection) => (
      <span className="text-blue-600">
        ${Math.round(projection.taxBenefit).toLocaleString()}
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
    tooltip: 'Estimated CGT payable if sold this year (includes 50% discount)',
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
    id: 'roi',
    header: 'ROI',
    tooltip: 'Return on investment percentage (includes CGT impact)',
    group: 'Financial Position',
    render: (projection) => (
      <span className={projection.roi >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
        {projection.roi.toFixed(1)}%
      </span>
    )
  }
];
