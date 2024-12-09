import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { PropertyDetails } from '../types';
import { cn } from '../../../lib/utils';
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';

interface DepreciationFormProps {
  propertyDetails: PropertyDetails;
  onDepreciationChange: (updates: {
    capitalWorks?: number;
    plantEquipment?: number;
  }) => void;
}

export function DepreciationForm({
  propertyDetails,
  onDepreciationChange,
}: DepreciationFormProps) {
  const handleCapitalWorksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, '')) || 0;
    onDepreciationChange({ capitalWorks: value });
  };

  const handlePlantEquipmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, '')) || 0;
    onDepreciationChange({ plantEquipment: value });
  };

  const totalDepreciation = 
    propertyDetails.capitalWorksDepreciation + 
    propertyDetails.plantEquipmentDepreciation;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium text-slate-700">
              Capital Works Depreciation
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="w-4 h-4 text-slate-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Capital works deductions (Division 43) are for the building's structure 
                    and permanently fixed items. The rate is typically 2.5% of the 
                    construction cost per year for 40 years.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium text-slate-900">$</span>
          <Input
            type="text"
            value={propertyDetails.capitalWorksDepreciation.toLocaleString()}
            onChange={handleCapitalWorksChange}
            className={cn(
              "h-10 text-lg font-medium text-slate-900",
              "focus-visible:ring-1 focus-visible:ring-slate-300"
            )}
          />
          <span className="text-sm text-slate-500">per year</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium text-slate-700">
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
                    appliances, carpets, and blinds. Each item has its own 
                    effective life and depreciation rate.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-medium text-slate-900">$</span>
          <Input
            type="text"
            value={propertyDetails.plantEquipmentDepreciation.toLocaleString()}
            onChange={handlePlantEquipmentChange}
            className={cn(
              "h-10 text-lg font-medium text-slate-900",
              "focus-visible:ring-1 focus-visible:ring-slate-300"
            )}
          />
          <span className="text-sm text-slate-500">per year</span>
        </div>
      </div>

      <div className="rounded-lg bg-slate-50 p-4 space-y-3">
        <h3 className="text-sm font-medium text-slate-700">
          Depreciation Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Capital Works</span>
            <span className="font-medium text-slate-900">
              ${propertyDetails.capitalWorksDepreciation.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Plant & Equipment</span>
            <span className="font-medium text-slate-900">
              ${propertyDetails.plantEquipmentDepreciation.toLocaleString()}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Annual Depreciation</span>
              <span className="font-medium text-slate-900">
                ${totalDepreciation.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
