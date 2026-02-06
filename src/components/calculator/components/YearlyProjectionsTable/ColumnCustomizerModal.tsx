import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '../../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../../components/ui/dialog';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Label } from '../../../../components/ui/label';
import { ColumnDef } from './columns';

interface ColumnCustomizerModalProps {
  columns: ColumnDef[];
  visibleColumns: string[];
  onToggleColumn: (columnId: string) => void;
}

export function ColumnCustomizerModal({ columns, visibleColumns, onToggleColumn }: ColumnCustomizerModalProps) {
  const columnGroups = Array.from(new Set(columns.map(col => col.group)));
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 sm:h-8 px-3 sm:px-2">
          <Settings2 className="h-4 w-4" />
          <span className="sm:hidden">Customize Columns</span>
          <span className="hidden sm:inline">Customize View</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Columns</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full">
          <div className="flex flex-col gap-2 p-2">
            {columnGroups.map((group, index) => (
              <div key={group}>
                {index > 0 && <div className="border-b border-border my-2" />}
                <div className="font-semibold text-sm opacity-50">
                  {group}
                </div>
                {columns
                  .filter(col => col.group === group)
                  .map(col => (
                    <div key={col.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={col.id}
                        checked={visibleColumns.includes(col.id)}
                        onCheckedChange={() => onToggleColumn(col.id)}
                      />
                      <Label htmlFor={col.id} className="text-sm">
                        {col.header}
                      </Label>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
