import { Settings2 } from 'lucide-react';
import { Button } from '../../../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '../../../ui/dropdown-menu';
import { ColumnDef } from './columns';

interface ColumnCustomizerProps {
  columns: ColumnDef[];
  visibleColumns: string[];
  onToggleColumn: (columnId: string) => void;
}

export function ColumnCustomizer({ columns, visibleColumns, onToggleColumn }: ColumnCustomizerProps) {
  const columnGroups = Array.from(new Set(columns.map(col => col.group)));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 sm:h-8 px-3 sm:px-2">
          <Settings2 className="h-4 w-4" />
          <span className="sm:hidden">Customize Columns</span>
          <span className="hidden sm:inline">Customize View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 sm:w-56">
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
                  onCheckedChange={() => onToggleColumn(col.id)}
                  className="text-sm py-2"
                >
                  {col.header}
                </DropdownMenuCheckboxItem>
              ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
