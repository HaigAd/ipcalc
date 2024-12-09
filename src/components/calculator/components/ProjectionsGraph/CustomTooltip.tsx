import { Card } from '../../../ui/card';
import { TooltipProps } from './types';
import { TooltipSection } from './TooltipSection';

export function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  // Find the non-null value if it exists
  const validPayload = payload.find(p => p.value !== null);
  if (!validPayload) return null;

  const data = validPayload.payload;

  return (
    <Card className="p-3 sm:p-4 bg-white shadow-lg max-w-[280px] sm:max-w-none">
      <h3 className="font-bold mb-2 text-sm sm:text-base">Year {label}</h3>

      <TooltipSection
        title="Basic Info"
        items={[
          { label: 'Property Value', value: data.propertyValue }
        ]}
      />

      <TooltipSection
        title="Loan Details"
        items={[
          { label: 'Loan Balance', value: data.loanBalance },
          { 
            label: 'Total Principal',
            value: data.cumulativePrincipalPaid,
            valueClassName: 'text-green-800 font-medium'
          },
          {
            label: 'Equity Position',
            value: data.propertyValue - data.loanBalance,
            valueClassName: 'text-green-800 font-medium'
          }
        ]}
      />

      <TooltipSection
        title="Rental Scenario"
        items={[
          {
            label: 'Yearly Rent',
            value: data.rentalCosts,
            valueClassName: 'text-purple-700'
          },
          {
            label: 'Cash Flow Diff',
            value: data.yearlyRentVsBuyCashFlow,
            valueClassName: data.yearlyRentVsBuyCashFlow >= 0 ? 'text-purple-700' : 'text-red-700'
          },
          {
            label: 'Annual Returns',
            value: data.yearlyOpportunityCost,
            valueClassName: 'text-blue-600'
          },
          {
            label: 'Total Returns',
            value: data.cumulativeOpportunityCost,
            valueClassName: 'text-blue-700 font-medium'
          },
          {
            label: 'Investment Pool',
            value: data.cumulativeInvestmentReserves,
            valueClassName: 'text-blue-800 font-medium'
          }
        ]}
      />

      <TooltipSection
        title="Comparative Analysis"
        items={[
          {
            label: 'Net Position',
            value: data.netPosition,
            valueClassName: data.netPosition >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'
          }
        ]}
      />
    </Card>
  );
}
