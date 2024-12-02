import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card } from '../../ui/card';
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
          <Input
            id="propertyGrowthRate"
            type="number"
            step="0.1"
            value={marketData.propertyGrowthRate}
            onChange={(e) => setMarketData({
              ...marketData,
              propertyGrowthRate: Number(e.target.value)
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rentIncreaseRate">Rent Increase Rate (%)</Label>
          <Input
            id="rentIncreaseRate"
            type="number"
            step="0.1"
            value={marketData.rentIncreaseRate}
            onChange={(e) => setMarketData({
              ...marketData,
              rentIncreaseRate: Number(e.target.value)
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="opportunityCostRate">Opportunity Cost Rate (%)</Label>
          <Input
            id="opportunityCostRate"
            type="number"
            step="0.1"
            value={marketData.opportunityCostRate}
            onChange={(e) => setMarketData({
              ...marketData,
              opportunityCostRate: Number(e.target.value)
            })}
          />
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
