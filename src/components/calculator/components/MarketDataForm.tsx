import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card } from '../../ui/card';
import { Slider } from '../../ui/slider';
import { MarketData } from '../types';
import PriceCorrectionsForm from './PriceCorrectionsForm';

interface MarketDataFormProps {
  marketData: MarketData;
  setMarketData: (data: MarketData) => void;
}

export function MarketDataForm({ marketData, setMarketData }: MarketDataFormProps) {
  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";
  const currentValueYear = marketData.currentValueYear ?? '';
  const currentPropertyValue = marketData.currentPropertyValue ?? '';

  const parseOptionalNumber = (value: string) => {
    if (value.trim() === '') {
      return undefined;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  return (
    <Card className="p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Market Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-4">
        <div className="space-y-3 sm:space-y-2">
          <Label htmlFor="propertyGrowthRate" className="text-sm font-medium">
            Property Growth Rate (%)
          </Label>
          <div className="pt-2 px-1">
            <Slider
              id="propertyGrowthRate"
              min={-3}
              max={10}
              step={0.1}
              value={[marketData.propertyGrowthRate]}
              onValueChange={(value) => setMarketData({
                ...marketData,
                propertyGrowthRate: value[0]
              })}
              className="touch-none"
            />
          </div>
          <div className="text-sm text-muted-foreground text-right pr-1">
            {marketData.propertyGrowthRate.toFixed(1)}%
          </div>
        </div>

        <div className="space-y-3 sm:space-y-2">
          <Label htmlFor="rentIncreaseRate" className="text-sm font-medium">
            Rent Increase Rate (%)
          </Label>
          <div className="pt-2 px-1">
            <Slider
              id="rentIncreaseRate"
              min={-3}
              max={10}
              step={0.1}
              value={[marketData.rentIncreaseRate]}
              onValueChange={(value) => setMarketData({
                ...marketData,
                rentIncreaseRate: value[0]
              })}
              className="touch-none"
            />
          </div>
          <div className="text-sm text-muted-foreground text-right pr-1">
            {marketData.rentIncreaseRate.toFixed(1)}%
          </div>
        </div>

        <div className="space-y-3 sm:space-y-2">
          <Label htmlFor="currentValueYear" className="text-sm font-medium">
            Current Year (optional)
          </Label>
          <Input
            id="currentValueYear"
            type="number"
            min="0"
            step="1"
            value={currentValueYear}
            onChange={(event) => setMarketData({
              ...marketData,
              currentValueYear: parseOptionalNumber(event.target.value)
            })}
            placeholder="Years since purchase"
            className={inputClasses}
          />
        </div>

        <div className="space-y-3 sm:space-y-2">
          <Label htmlFor="currentPropertyValue" className="text-sm font-medium">
            Current Property Value (optional)
          </Label>
          <Input
            id="currentPropertyValue"
            type="number"
            min="0"
            step="1000"
            value={currentPropertyValue}
            onChange={(event) => setMarketData({
              ...marketData,
              currentPropertyValue: parseOptionalNumber(event.target.value)
            })}
            placeholder="Value at current year"
            className={inputClasses}
          />
        </div>
      </div>

      <PriceCorrectionsForm
        propertyValueCorrections={marketData.propertyValueCorrections}
        onCorrectionsUpdate={(changes) => setMarketData({
          ...marketData,
          propertyValueCorrections: changes
        })}
      />
    </Card>
  );
}
