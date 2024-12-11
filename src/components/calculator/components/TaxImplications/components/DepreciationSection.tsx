import { InfoIcon } from 'lucide-react';
import { Input } from '../../../../ui/input';
import { Label } from '../../../../ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../ui/tooltip';
import { cn } from '../../../../../lib/utils';

interface DepreciationSectionProps {
  capitalWorksValue: number;
  plantEquipmentValue: number;
  onCapitalWorksChange: (value: string) => void;
  onPlantEquipmentChange: (value: string) => void;
}

export function DepreciationSection({
  capitalWorksValue,
  plantEquipmentValue,
  onCapitalWorksChange,
  onPlantEquipmentChange,
}: DepreciationSectionProps) {
  return (
    <div className="space-y-6">
      {/* Capital Works Depreciation */}
      <div className="rounded-lg border border-slate-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Capital Works Depreciation
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-4 h-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Capital works (Division 43) covers the building's structure at 2.5% 
                  of construction cost per year for 40 years.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium text-slate-900">$</span>
          <Input
            type="text"
            value={capitalWorksValue.toLocaleString()}
            onChange={(e) => onCapitalWorksChange(e.target.value)}
            className={cn(
              "h-10 text-lg font-medium text-slate-900",
              "focus-visible:ring-1 focus-visible:ring-slate-300"
            )}
          />
          <span className="text-sm text-slate-500">per year</span>
        </div>
      </div>

      {/* Plant & Equipment Depreciation */}
      <div className="rounded-lg border border-slate-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            Plant & Equipment Depreciation
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="w-4 h-4 text-slate-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Plant and equipment (Division 40) covers removable items like 
                  appliances and carpets, each with their own depreciation rate.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium text-slate-900">$</span>
          <Input
            type="text"
            value={plantEquipmentValue.toLocaleString()}
            onChange={(e) => onPlantEquipmentChange(e.target.value)}
            className={cn(
              "h-10 text-lg font-medium text-slate-900",
              "focus-visible:ring-1 focus-visible:ring-slate-300"
            )}
          />
          <span className="text-sm text-slate-500">per year</span>
        </div>
      </div>
    </div>
  );
}
