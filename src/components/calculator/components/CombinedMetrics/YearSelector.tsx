import { ScrollArea } from "../../../ui/scroll-area";
import { cn } from "../../../../lib/utils";

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium text-slate-700">Analysis Year:</span>
      <ScrollArea className="w-[300px] whitespace-nowrap rounded-md border border-slate-200">
        <div className="flex p-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={cn(
                "px-3 py-1 rounded-sm text-sm transition-colors",
                selectedYear === year
                  ? "bg-slate-900 text-white"
                  : "hover:bg-slate-100 text-slate-600"
              )}
            >
              Year {year}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
