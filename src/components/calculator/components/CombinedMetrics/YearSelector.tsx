import { Slider } from "../../../ui/slider";

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export function YearSelector({ years, selectedYear, onYearChange }: YearSelectorProps) {
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  
  const handleSliderChange = (value: number[]) => {
    // Find the closest year in our years array to the slider value
    const year = Math.round(value[0]);
    const closestYear = years.reduce((prev, curr) => {
      return Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev;
    });
    onYearChange(closestYear);
  };

  const displayYear = selectedYear;
  const displayMinYear = minYear;
  const displayMaxYear = maxYear;

  return (
    <div className="flex flex-col gap-2 mb-4 w-full">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">Analysis Year</span>
        <span className="text-lg font-semibold text-slate-900">{displayYear}</span>
      </div>
      <div className="px-1">
        <Slider
          value={[selectedYear]}
          min={minYear}
          max={maxYear}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full h-4"
        />
      </div>
      <div className="flex justify-between text-xs text-slate-500 px-1">
        <span>{displayMinYear}</span>
        <span>{displayMaxYear}</span>
      </div>
    </div>
  );
}
