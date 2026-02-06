import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip';
import { ColumnDef } from './columns';

interface TableHeaderProps {
  columns: ColumnDef[];
  visibleColumns: string[];
}

export function TableHeader({ columns, visibleColumns }: TableHeaderProps) {
  const columnGroups = Array.from(new Set(columns.map(col => col.group)));

  const getVisibleColumnsForGroup = (group: string) => {
    return columns.filter(col => col.group === group && visibleColumns.includes(col.id));
  };

  return (
    <thead>
      <tr className="bg-slate-50">
        {columnGroups.map((group) => {
          const groupColumns = getVisibleColumnsForGroup(group);
          if (groupColumns.length === 0) return null;
          return (
            <th
              key={group}
              colSpan={groupColumns.length}
              className="sticky top-0 z-20 text-[10px] sm:text-xs text-slate-500 font-normal p-1.5 sm:p-2 text-left border-b border-l first:border-l-0 bg-slate-50"
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
              className={`sticky top-[28px] sm:top-[32px] z-10 bg-slate-50 text-left p-2 sm:p-3 text-xs sm:text-sm font-medium text-slate-700
                ${index > 0 && columns[index - 1].group !== col.group ? 'border-l' : ''}
              `}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left font-medium hover:cursor-help">
                    {col.header}
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs whitespace-pre-line max-w-[200px] sm:max-w-none z-50">
                    {col.tooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </th>
          ))}
      </tr>
    </thead>
  );
}
