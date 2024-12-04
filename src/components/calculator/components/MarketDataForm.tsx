import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card } from '../../ui/card';
import { Slider } from '../../ui/slider';
import { MarketData } from '../types';

interface MarketDataFormProps {
  marketData: MarketData;
  setMarketData: (data: MarketData) => void;
}

export function MarketDataForm({ marketData, setMarketData }: MarketDataFormProps) {
  const inputClasses = "h-12 sm:h-11 px-4 text-base sm:text-sm border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow w-full touch-manipulation";

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
          <Label htmlFor="opportunityCostRate" className="text-sm font-medium">
            Opportunity Cost Rate (%)
          </Label>
          <div className="pt-2 px-1">
            <Slider
              id="opportunityCostRate"
              min={-3}
              max={10}
              step={0.1}
              value={[marketData.opportunityCostRate]}
              onValueChange={(value) => setMarketData({
                ...marketData,
                opportunityCostRate: value[0]
              })}
              className="touch-none"
            />
          </div>
          <div className="text-sm text-muted-foreground text-right pr-1">
            {marketData.opportunityCostRate.toFixed(1)}%
          </div>
        </div>
      </div>
    </Card>
  );
}
