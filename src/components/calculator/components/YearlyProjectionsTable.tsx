import { useState } from 'react';
import { Card } from '../../ui/card';
import { CalculationResults, PropertyDetails, MarketData } from '../types';
import { TaxImplications } from './TaxImplications';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import { Settings2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';

interface YearlyProjectionsTableProps {
  yearlyProjections: CalculationResults['yearlyProjections'];
  propertyDetails: PropertyDetails;
  marketData: MarketData;
}

interface ColumnDef {
  id: string;
  header: string;
  tooltip: string;
  group: string;
  render: (projection: CalculationResults['yearlyProjections'][0]) => React.ReactNode;
}

export function YearlyProjectionsTable({ yearlyProjections, propertyDetails, marketData }: YearlyProjectionsTableProps) {
  const columns: ColumnDef[] = [
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
      tooltip: 'Remaining loan amount',
      group: 'Loan Details',
      render: (projection) => `$${Math.round(projection.loanBalance).toLocaleString()}`
    },
    {
      id: 'yearlyPrincipalPaid',
      header: 'Principal Paid',
      tooltip: 'Amount of loan principal paid this year',
      group: 'Loan Details',
      render: (projection) => (
        <span className="text-green-700">
          ${Math.round(projection.yearlyPrincipalPaid).toLocaleString()}
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
      id: 'cumulativeRentalCosts',
      header: 'Total Rent Paid',
      tooltip: 'Cumulative rental costs to date',
      group: 'Rental Scenario',
      render: (projection) => (
        <span className="text-purple-800">
          ${Math.round(projection.cumulativeRentalCosts).toLocaleString()}
        </span>
      )
    },
    {
      id: 'opportunityCost',
      header: 'Investment Returns',
      tooltip: `Cumulative returns at ${marketData.opportunityCostRate}% from investing:\n• Deposit and purchase costs\n• Offset account balance\n\nCompound interest is calculated yearly`,
      group: 'Rental Scenario',
      render: (projection) => (
        <span className="text-purple-800 font-medium">
          ${Math.round(projection.cumulativePrincipalSavingsOpportunityCost).toLocaleString()}
        </span>
      )
    },
    {
      id: 'netPosition',
      header: 'Net Position',
      tooltip: 'Overall financial position comparing buying vs renting',
      group: 'Comparative Analysis',
      render: (projection) => (
        <span className={projection.netPosition >= 0 ? 'text-blue-700' : 'text-red-700'}>
          ${Math.round(projection.netPosition).toLocaleString()}
        </span>
      )
    }
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map(col => col.id)
  );

  const toggleColumn = (columnId: string) => {
    setVisibleColumns(current =>
      current.includes(columnId)
        ? current.filter(id => id !== columnId)
        : [...current, columnId]
    );
  };

  const columnGroups = Array.from(new Set(columns.map(col => col.group)));

  // Get visible columns for a specific group
  const getVisibleColumnsForGroup = (group: string) => {
    return columns.filter(col => col.group === group && visibleColumns.includes(col.id));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Yearly Projections</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings2 className="h-4 w-4" />
              <span>Customize View</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {columnGroups.map((group, index) => (
              <div key={group}>
                {index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem disabled className="font-semibold text-sm opacity-50">
                  {group}
                </DropdownMenuItem>
                {columns
                  .filter(col => col.group === group)
                  .map(col => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={visibleColumns.includes(col.id)}
                      onCheckedChange={() => toggleColumn(col.id)}
                      className="text-sm"
                    >
                      {col.header}
                    </DropdownMenuCheckboxItem>
                  ))}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <TaxImplications
        yearlyProjections={yearlyProjections}
        propertyDetails={propertyDetails}
        marketData={marketData}
      />

      <div className="overflow-x-auto mt-6 rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              {columnGroups.map((group) => {
                const groupColumns = getVisibleColumnsForGroup(group);
                if (groupColumns.length === 0) return null;
                return (
                  <th
                    key={group}
                    colSpan={groupColumns.length}
                    className="text-xs text-slate-500 font-normal p-2 text-left border-b border-l first:border-l-0"
                  >
                    {group}
                  </th>
                );
              })}
            </tr>
            <tr className="bg-slate-50 border-b">
              {columns
                .filter(col => visibleColumns.includes(col.id))
                .map((col, index) => (
                  <th 
                    key={col.id} 
                    className={`text-left p-3 text-sm font-medium text-slate-700
                      ${index > 0 && columns[index - 1].group !== col.group ? 'border-l' : ''}
                    `}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left font-medium hover:cursor-help">
                          {col.header}
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs whitespace-pre-line">
                          {col.tooltip}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {yearlyProjections.map((projection) => (
              <tr key={projection.year} className="hover:bg-slate-50">
                {columns
                  .filter(col => visibleColumns.includes(col.id))
                  .map((col, index) => (
                    <td 
                      key={col.id} 
                      className={`p-3 text-sm
                        ${index > 0 && columns[index - 1].group !== col.group ? 'border-l' : ''}
                      `}
                    >
                      {col.render(projection)}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-1.5 text-sm text-slate-500">
        <p>• Principal Paid shows the amount of loan principal paid down each year</p>
        <p>• Total Principal shows the cumulative amount of principal paid to date</p>
        <p>• Yearly Rent shows the annual cost of renting instead of buying</p>
        <p>• Total Rent Paid shows the cumulative rental costs to date</p>
        <p>• Investment Returns shows cumulative returns at {marketData.opportunityCostRate}% from investing the deposit, purchase costs, and offset balance (with compound interest)</p>
        <p>• Net Position compares rental costs plus investment returns against buying costs plus equity (property value minus loan and sale costs)</p>
      </div>
    </Card>
  );
}
