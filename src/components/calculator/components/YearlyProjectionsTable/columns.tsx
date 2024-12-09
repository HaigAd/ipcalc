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
    id: 'cumulativeOffsetContributions',
    header: 'Total Contrib.',
    tooltip: 'Total contributions made to offset account to date',
    group: 'Loan Details',
    render: (projection) => (
      <span className="text-blue-700 font-medium">
        ${Math.round(projection.cumulativeOffsetContributions).toLocaleString()}
      </span>
    )
  },
  {
    id: 'cumulativePrincipalPaid',
    header: 'Total Principal',
    tooltip: 'Total amount of principal paid to date',
    group: 'Loan Details',
    render: (projection) => (
      <span className="text-green-800 font-medium">
        ${Math.round(projection.cumulativePrincipalPaid).toLocaleString()}
      </span>
    )
  },
  {
    id: 'equityPosition',
    header: 'Equity Position',
    tooltip: 'Equity available in the home (current value minus loan liabilitiies)',
    group: 'Loan Details',
    render: (projection) => (
      <span className="text-green-800 font-medium">
        ${Math.round(projection.propertyValue - projection.effectiveLoanBalance).toLocaleString()}
      </span>
    )
  },
  {
    id: 'yearlyRentalCosts',
    header: 'Yearly Rent',
    tooltip: 'Annual rental costs if renting instead of buying',
    group: 'Rental Scenario',
    render: (projection) => (
      <span className="text-purple-700">
        ${Math.round(projection.rentalCosts).toLocaleString()}
      </span>
    )
  },
  {
    id: 'yearlyRentVsBuyCashFlow',
    header: 'Cash Flow Diff',
    tooltip: 'Annual cash flow difference between renting vs buying (positive means renting saves money)',
    group: 'Rental Scenario',
    render: (projection) => (
      <span className={projection.yearlyRentVsBuyCashFlow >= 0 ? 'text-purple-700' : 'text-red-700'}>
        ${Math.round(projection.yearlyRentVsBuyCashFlow).toLocaleString()}
      </span>
    )
  },
  {
    id: 'yearlyOpportunityCost',
    header: 'Annual Returns',
    tooltip: `Returns earned this year at ${marketData.opportunityCostRate}% on the investment pool`,
    group: 'Rental Scenario',
    render: (projection) => (
      <span className="text-blue-600">
        ${Math.round(projection.yearlyOpportunityCost).toLocaleString()}
      </span>
    )
  },
  {
    id: 'cumulativeOpportunityCost',
    header: 'Total Returns',
    tooltip: `Total investment returns accumulated to date at ${marketData.opportunityCostRate}%`,
    group: 'Rental Scenario',
    render: (projection) => (
      <span className="text-blue-700 font-medium">
        ${Math.round(projection.cumulativeOpportunityCost).toLocaleString()}
      </span>
    )
  },
  {
    id: 'cumulativeInvestmentReserves',
    header: 'Investment Pool',
    tooltip: `Total amount available for investment if renting:\n• Initial deposit & costs\n• Annual cash flow savings\n• Regular contributions\n• Compound returns at ${marketData.opportunityCostRate}%`,
    group: 'Rental Scenario',
    render: (projection) => (
      <span className="text-blue-800 font-medium">
        ${Math.round(projection.cumulativeInvestmentReserves).toLocaleString()}
      </span>
    )
  },
  {
    id: 'netPosition',
    header: 'Net Position',
    tooltip: 'Total investment returns plus rental costs, minus property equity (value minus loan and selling costs)',
    group: 'Comparative Analysis',
    render: (projection) => (
      <span className={projection.netPosition >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
        ${Math.round(projection.netPosition).toLocaleString()}
      </span>
    )
  }
];
