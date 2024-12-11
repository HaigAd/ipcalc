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
        title="Property Details"
        items={[
          { label: 'Property Value', value: data.propertyValue },
          { 
            label: 'Equity',
            value: data.equity,
            valueClassName: 'text-green-800 font-medium'
          }
        ]}
      />

      <TooltipSection
        title="Income & Expenses"
        items={[
          {
            label: 'Rental Income',
            value: data.rentalIncome,
            valueClassName: 'text-green-600'
          },
          {
            label: 'Management Fees',
            value: data.managementFees,
            valueClassName: 'text-red-600'
          },
          {
            label: 'Total Expenses',
            value: data.yearlyExpenses,
            valueClassName: 'text-red-700'
          }
        ]}
      />

      <TooltipSection
        title="Financial Position"
        items={[
          {
            label: 'Cash Flow',
            value: data.cashFlow,
            valueClassName: data.cashFlow >= 0 ? 'text-green-700' : 'text-red-700'
          },
          {
            label: 'Tax Benefit',
            value: data.taxBenefit,
            valueClassName: 'text-blue-600'
          },
          {
            label: 'ROI',
            value: data.roi,
            isPercentage: true,
            valueClassName: data.roi >= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'
          }
        ]}
      />

      <TooltipSection
        title="Loan Details"
        items={[
          { 
            label: 'Loan Balance', 
            value: data.effectiveLoanBalance 
          },
          {
            label: 'Offset Balance',
            value: data.offsetBalance,
            valueClassName: 'text-blue-600'
          },
          {
            label: 'Interest Saved',
            value: data.interestSaved,
            valueClassName: 'text-green-600'
          }
        ]}
      />
    </Card>
  );
}
