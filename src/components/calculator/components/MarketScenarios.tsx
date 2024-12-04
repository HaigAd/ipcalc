import { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Slider } from '../../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { MarketScenario, MarketData, PropertyDetails } from '../types';
import { useMarketScenarios } from '../hooks/useMarketScenarios';

interface MarketScenariosProps {
  propertyDetails: PropertyDetails;
  baseMarketData: MarketData;
  onScenarioChange: (scenarios: MarketScenario[]) => void;
}

export function MarketScenarios({ propertyDetails, baseMarketData, onScenarioChange }: MarketScenariosProps) {
  const {
    scenarios,
    sensitivityConfig,
    createScenario,
    updateScenario,
    deleteScenario,
    generateSensitivityScenarios,
    scenarioProjections
  } = useMarketScenarios(propertyDetails);

  const [newScenarioName, setNewScenarioName] = useState('');
  const [selectedParameter, setSelectedParameter] = useState<keyof MarketData>('propertyGrowthRate');

  const handleCreateScenario = () => {
    if (newScenarioName) {
      createScenario(
        newScenarioName,
        'Custom scenario',
        { ...baseMarketData }
      );
      setNewScenarioName('');
      onScenarioChange(scenarios);
    }
  };

  const handleGenerateSensitivity = () => {
    generateSensitivityScenarios(baseMarketData, selectedParameter);
    onScenarioChange(scenarios);
  };

  const handleUpdateScenario = (id: string, marketData: MarketData) => {
    updateScenario(id, { marketData });
    onScenarioChange(scenarios);
  };

  const handleDeleteScenario = (id: string) => {
    deleteScenario(id);
    onScenarioChange(scenarios);
  };

  return (
    <Card className="p-4 sm:p-6">
      <Tabs defaultValue="scenarios" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="scenarios">Market Scenarios</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="scenarioName" className="text-sm font-medium mb-2">
                  New Scenario Name
                </Label>
                <Input
                  id="scenarioName"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="Enter scenario name"
                  className="h-9"
                />
              </div>
              <Button onClick={handleCreateScenario} className="h-9">
                Add Scenario
              </Button>
            </div>

            <div className="space-y-4">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: scenario.color }}>
                      {scenario.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteScenario(scenario.id)}
                    >
                      Delete
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Property Growth Rate (%)</Label>
                      <Slider
                        min={sensitivityConfig.propertyGrowth.min}
                        max={sensitivityConfig.propertyGrowth.max}
                        step={sensitivityConfig.propertyGrowth.step}
                        value={[scenario.marketData.propertyGrowthRate]}
                        onValueChange={(value) => handleUpdateScenario(scenario.id, {
                          ...scenario.marketData,
                          propertyGrowthRate: value[0]
                        })}
                      />
                      <div className="text-sm text-right">
                        {scenario.marketData.propertyGrowthRate.toFixed(1)}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Rent Increase Rate (%)</Label>
                      <Slider
                        min={sensitivityConfig.rentIncrease.min}
                        max={sensitivityConfig.rentIncrease.max}
                        step={sensitivityConfig.rentIncrease.step}
                        value={[scenario.marketData.rentIncreaseRate]}
                        onValueChange={(value) => handleUpdateScenario(scenario.id, {
                          ...scenario.marketData,
                          rentIncreaseRate: value[0]
                        })}
                      />
                      <div className="text-sm text-right">
                        {scenario.marketData.rentIncreaseRate.toFixed(1)}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Opportunity Cost Rate (%)</Label>
                      <Slider
                        min={sensitivityConfig.opportunityCost.min}
                        max={sensitivityConfig.opportunityCost.max}
                        step={sensitivityConfig.opportunityCost.step}
                        value={[scenario.marketData.opportunityCostRate]}
                        onValueChange={(value) => handleUpdateScenario(scenario.id, {
                          ...scenario.marketData,
                          opportunityCostRate: value[0]
                        })}
                      />
                      <div className="text-sm text-right">
                        {scenario.marketData.opportunityCostRate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sensitivity">
          <div className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="parameter" className="text-sm font-medium mb-2">
                  Parameter to Analyze
                </Label>
                <select
                  id="parameter"
                  value={selectedParameter}
                  onChange={(e) => setSelectedParameter(e.target.value as keyof MarketData)}
                  className="w-full h-9 rounded-md border border-slate-200 px-3"
                >
                  <option value="propertyGrowthRate">Property Growth Rate</option>
                  <option value="rentIncreaseRate">Rent Increase Rate</option>
                  <option value="opportunityCostRate">Opportunity Cost Rate</option>
                </select>
              </div>
              <Button onClick={handleGenerateSensitivity} className="h-9">
                Generate Analysis
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
