import { InfoIcon, Upload } from 'lucide-react';
import { Input } from '../../../../ui/input';
import { Label } from '../../../../ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../ui/tooltip';
import { cn } from '../../../../../lib/utils';
import { DepreciationMode, DepreciationSchedule, YearlyDepreciation } from '../../../utils/depreciation';
import { RadioGroup, RadioGroupItem } from '../../../../ui/radio-group';
import { Button } from '../../../../ui/button';
import { useState } from 'react';

interface DepreciationSectionProps {
  schedule: DepreciationSchedule;
  onScheduleChange: (schedule: DepreciationSchedule) => void;
  loanTerm?: number; // Optional: Used to determine number of years for manual input
}

export function DepreciationSection({
  schedule,
  onScheduleChange,
  loanTerm = 30, // Default to 30 years if not specified
}: DepreciationSectionProps) {
  const [yearlyInputs, setYearlyInputs] = useState<YearlyDepreciation[]>(
    schedule.yearlySchedule || Array(loanTerm).fill({ capitalWorks: 0, plantEquipment: 0 })
  );

  const handleModeChange = (mode: DepreciationMode) => {
    const newSchedule: DepreciationSchedule = {
      mode,
      fixedCapitalWorks: schedule.fixedCapitalWorks,
      fixedPlantEquipment: schedule.fixedPlantEquipment,
      yearlySchedule: yearlyInputs,
    };
    onScheduleChange(newSchedule);
  };

  const handleFixedChange = (type: 'capitalWorks' | 'plantEquipment', value: string) => {
    const numValue = Number(value.replace(/[^0-9]/g, ''));
    const newSchedule = {
      ...schedule,
      [`fixed${type.charAt(0).toUpperCase() + type.slice(1)}`]: numValue,
    };
    onScheduleChange(newSchedule);
  };

  const handleYearlyChange = (year: number, type: keyof YearlyDepreciation, value: string) => {
    const numValue = Number(value.replace(/[^0-9]/g, ''));
    const newInputs = [...yearlyInputs];
    newInputs[year] = {
      ...newInputs[year],
      [type]: numValue,
    };
    setYearlyInputs(newInputs);
    onScheduleChange({
      ...schedule,
      yearlySchedule: newInputs,
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.split(','));
      const newSchedule: YearlyDepreciation[] = rows.map(([capitalWorks, plantEquipment]) => ({
        capitalWorks: Number(capitalWorks) || 0,
        plantEquipment: Number(plantEquipment) || 0,
      }));

      setYearlyInputs(newSchedule);
      onScheduleChange({
        ...schedule,
        mode: 'file',
        yearlySchedule: newSchedule,
      });
    } catch (error) {
      console.error('Error reading file:', error);
      // TODO: Add error handling UI
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 p-4">
        <Label className="text-sm font-medium mb-4 block">Depreciation Mode</Label>
        <RadioGroup
          value={schedule.mode}
          onValueChange={value => handleModeChange(value as DepreciationMode)}
          className="grid gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fixed" />
            <Label htmlFor="fixed">Fixed Yearly Amount</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="manual" />
            <Label htmlFor="manual">Manual Yearly Input</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="file" id="file" />
            <Label htmlFor="file">Upload Schedule</Label>
          </div>
        </RadioGroup>
      </div>

      {schedule.mode === 'fixed' && (
        <>
          {/* Capital Works Depreciation */}
          <div className="rounded-lg border border-slate-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Capital Works Depreciation</Label>
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
                value={schedule.fixedCapitalWorks?.toLocaleString() || '0'}
                onChange={(e) => handleFixedChange('capitalWorks', e.target.value)}
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
              <Label className="text-sm font-medium">Plant & Equipment Depreciation</Label>
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
                value={schedule.fixedPlantEquipment?.toLocaleString() || '0'}
                onChange={(e) => handleFixedChange('plantEquipment', e.target.value)}
                className={cn(
                  "h-10 text-lg font-medium text-slate-900",
                  "focus-visible:ring-1 focus-visible:ring-slate-300"
                )}
              />
              <span className="text-sm text-slate-500">per year</span>
            </div>
          </div>
        </>
      )}

      {schedule.mode === 'manual' && (
        <div className="rounded-lg border border-slate-200 p-4 space-y-4">
          <Label className="text-sm font-medium">Yearly Depreciation Schedule</Label>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {yearlyInputs.map((yearData, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 border border-slate-100 rounded">
                <div className="space-y-2">
                  <Label className="text-xs">Year {index + 1} Capital Works</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">$</span>
                    <Input
                      type="text"
                      value={yearData.capitalWorks.toLocaleString()}
                      onChange={(e) => handleYearlyChange(index, 'capitalWorks', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Plant & Equipment</Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">$</span>
                    <Input
                      type="text"
                      value={yearData.plantEquipment.toLocaleString()}
                      onChange={(e) => handleYearlyChange(index, 'plantEquipment', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {schedule.mode === 'file' && (
        <div className="rounded-lg border border-slate-200 p-4 space-y-4">
          <Label className="text-sm font-medium">Upload Depreciation Schedule</Label>
          <div className="space-y-2">
            <p className="text-sm text-slate-500">
              Upload a CSV file with two columns: Capital Works and Plant & Equipment depreciation amounts
            </p>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Label>
            </div>
            {schedule.yearlySchedule && schedule.yearlySchedule.length > 0 && (
              <p className="text-sm text-green-600">
                Schedule loaded: {schedule.yearlySchedule.length} years
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
