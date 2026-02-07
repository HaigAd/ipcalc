import React, { useState } from 'react';
import { CalculationResults, MarketData, PropertyDetails, CostStructure } from '../../types';
import { getColumns } from './columns';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TableFooter } from './TableFooter';
import { ColumnCustomizerModal } from './ColumnCustomizerModal';

interface YearlyProjectionsTableProps {
  yearlyProjections: CalculationResults['yearlyProjections'];
  marketData: MarketData;
  propertyDetails: PropertyDetails;
  costStructure: CostStructure;
}

export function YearlyProjectionsTable({ yearlyProjections, marketData, propertyDetails, costStructure }: YearlyProjectionsTableProps) {
  const columns = getColumns(marketData, propertyDetails, costStructure);
  // Default to showing only essential columns on mobile
  const defaultVisibleColumns = [
    'year',
    'propertyValue',
    'rentalIncome',
    'cashFlow',
    'netPosition',
    'roi',
    'roiInitialInvestment'
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumns);

  const handleToggleColumn = (columnId: string) => {
    setVisibleColumns(current => {
      if (current.includes(columnId)) {
        // Don't allow hiding the year column
        if (columnId === 'year') return current;
        return current.filter(id => id !== columnId);
      }
      return [...current, columnId];
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnCustomizerModal
          columns={columns}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
        />
      </div>
      
      <div className="relative max-h-[70vh] overflow-auto -mx-3 sm:mx-0">
        <div className="overflow-visible">
          <div className="inline-block min-w-full align-middle">
            <div className="border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <TableHeader
                  columns={columns}
                  visibleColumns={visibleColumns}
                />
                <TableBody
                  columns={columns}
                  visibleColumns={visibleColumns}
                  yearlyProjections={yearlyProjections}
                />
              </table>
            </div>
          </div>
        </div>
      </div>

      <TableFooter marketData={marketData} />
    </div>
  );
}
