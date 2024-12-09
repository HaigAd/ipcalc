import { CalculationResults } from '../../types';
import { ColumnDef } from './columns';

interface TableBodyProps {
  columns: ColumnDef[];
  visibleColumns: string[];
  yearlyProjections: CalculationResults['yearlyProjections'];
}

export function TableBody({ columns, visibleColumns, yearlyProjections }: TableBodyProps) {
  return (
    <tbody className="divide-y">
      {yearlyProjections.map((projection) => (
        <tr key={projection.year} className="hover:bg-slate-50">
          {columns
            .filter(col => visibleColumns.includes(col.id))
            .map((col, index) => (
              <td 
                key={col.id} 
                className={`p-2 sm:p-3 text-xs sm:text-sm
                  ${index > 0 && columns[index - 1].group !== col.group ? 'border-l' : ''}
                `}
              >
                {col.render(projection)}
              </td>
            ))}
        </tr>
      ))}
    </tbody>
  );
}
