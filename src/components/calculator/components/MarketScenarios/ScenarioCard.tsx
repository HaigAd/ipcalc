import { Card } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { MarketData, MarketScenario } from '../../types';
import { ScenarioSlider } from './ScenarioSlider';
import { SensitivityConfig } from '../../types';

interface ScenarioCardProps {
  scenario: MarketScenario;
  sensitivityConfig: SensitivityConfig;
  onUpdate: (id: string, marketData: MarketData) => void;
  onDelete: (id: string) => void;
}

export function ScenarioCard({
  scenario,
  sensitivityConfig,
  onUpdate,
  onDelete
}: ScenarioCardProps) {
  const handleSliderChange = (key: keyof MarketData) => (value: number) => {
    onUpdate(scenario.id, {
      ...scenario.marketData,
      [key]: value
    });
  };

  return (
    <Card key={scenario.id} className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: scenario.color }}>
          {scenario.name}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(scenario.id)}
        >
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScenarioSlider
          label="Property Growth Rate (%)"
          value={scenario.marketData.propertyGrowthRate}
          min={sensitivityConfig.propertyGrowth.min}
          max={sensitivityConfig.propertyGrowth.max}
          step={sensitivityConfig.propertyGrowth.step}
          onChange={handleSliderChange('propertyGrowthRate')}
        />

        <ScenarioSlider
          label="Rent Increase Rate (%)"
          value={scenario.marketData.rentIncreaseRate}
          min={sensitivityConfig.rentIncrease.min}
          max={sensitivityConfig.rentIncrease.max}
          step={sensitivityConfig.rentIncrease.step}
          onChange={handleSliderChange('rentIncreaseRate')}
        />

        <ScenarioSlider
          label="Opportunity Cost Rate (%)"
          value={scenario.marketData.opportunityCostRate}
          min={sensitivityConfig.opportunityCost.min}
          max={sensitivityConfig.opportunityCost.max}
          step={sensitivityConfig.opportunityCost.step}
          onChange={handleSliderChange('opportunityCostRate')}
        />
      </div>
    </Card>
  );
}
