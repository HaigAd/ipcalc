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
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Market Data</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyGrowthRate">Property Growth Rate (%)</Label>
          <div className="pt-2">
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
            />
          </div>
          <div className="text-sm text-muted-foreground text-right">
            {marketData.propertyGrowthRate.toFixed(1)}%
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rentIncreaseRate">Rent Increase Rate (%)</Label>
          <div className="pt-2">
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
            />
          </div>
          <div className="text-sm text-muted-foreground text-right">
            {marketData.rentIncreaseRate.toFixed(1)}%
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="opportunityCostRate">Opportunity Cost Rate (%)</Label>
          <div className="pt-2">
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
            />
          </div>
          <div className="text-sm text-muted-foreground text-right">
            {marketData.opportunityCostRate.toFixed(1)}%
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="otherPropertyValue">Other Property Value ($)</Label>
          <Input
            id="otherPropertyValue"
            type="number"
            value={marketData.otherPropertyValue}
            onChange={(e) => setMarketData({
              ...marketData,
              otherPropertyValue: Number(e.target.value)
            })}
          />
        </div>
      </div>
    </Card>
  );
}
