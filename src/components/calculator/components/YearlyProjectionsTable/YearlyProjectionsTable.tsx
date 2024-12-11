import React, { useState } from 'react';
import { CalculationResults, MarketData } from '../../types';
import { getColumns } from './columns';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TableFooter } from './TableFooter';
import { ColumnCustomizer } from './ColumnCustomizer';

interface YearlyProjectionsTableProps {
  yearlyProjections: CalculationResults['yearlyProjections'];
  marketData: MarketData;
}

export function YearlyProjectionsTable({ yearlyProjections, marketData }: YearlyProjectionsTableProps) {
  const columns = getColumns(marketData);
  
  // Initialize with all columns visible
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map(col => col.id)
  );

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
        <ColumnCustomizer
          columns={columns}
          visibleColumns={visibleColumns}
          onToggleColumn={handleToggleColumn}
        />
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
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

      <TableFooter marketData={marketData} />
    </div>
  );
}
