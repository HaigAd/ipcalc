import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../ui/button';
import { useCalculatorState } from '../hooks/useCalculatorState';
import { useScenarioProjectionsData } from './ScenarioComparison/useScenarioProjectionsData';
import {
  LineChart,
  Line,
  XAxis,  
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { Slider } from '@mui/material';
import { formatNumberWithKMB } from '../utils/formatters';

const getScenarioColor = (id: string) => {
  // Generate a consistent hue from the scenario ID to avoid palette reuse.
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 70% 45%)`;
};

const ScenarioComparison = () => {
  const { scenarios } = useCalculatorState();
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set());

  // Initialize selected scenarios with all scenario IDs
  useEffect(() => {
    if (scenarios) {
      setSelectedScenarios(new Set(scenarios.map(s => s.id)));
    }
  }, [scenarios]);

  const handleScenarioToggle = (scenarioId: string) => {
    setSelectedScenarios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(scenarioId)) {
        newSet.delete(scenarioId);
      } else {
        newSet.add(scenarioId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && scenarios) {
      setSelectedScenarios(new Set(scenarios.map(s => s.id)));
    } else {
      setSelectedScenarios(new Set());
    }
  };
  const processedData = useScenarioProjectionsData(scenarios);
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 100]);
  const years = useMemo(() => processedData.map(d => d.year), [processedData]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) return;
    setZoomRange(newValue as [number, number]);
  };

  const zoomDomain = useMemo(() => {
    if (!years.length) return null;
    const startIndex = Math.floor((zoomRange[0] / 100) * (years.length - 1));
    const endIndex = Math.floor((zoomRange[1] / 100) * (years.length - 1));
    const startYear = years[startIndex];
    const endYear = years[endIndex];
    return [startYear, endYear];
  }, [zoomRange, years]);


  if (!scenarios || scenarios.length === 0) {
    return <div>No scenarios saved yet.</div>;
  }

  const filteredData = useMemo((): any[] => {
    if (!zoomDomain) return processedData || [];
    return (processedData || []).filter(d => 
      d.year >= zoomDomain[0] && d.year <= zoomDomain[1]
    );
  }, [processedData, zoomDomain]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Scenario Comparison</h2>
      <div className="mb-6">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSelectAll(selectedScenarios.size !== scenarios?.length)}
            className="text-sm"
          >
            {selectedScenarios.size === scenarios?.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
            {scenarios?.map((scenario, index) => (
            <Button
              key={scenario.id}
              variant={selectedScenarios.has(scenario.id) ? "default" : "outline"}
              onClick={() => handleScenarioToggle(scenario.id)}
              className="rounded-full"
              style={{
                borderColor: getScenarioColor(scenario.id),
                backgroundColor: selectedScenarios.has(scenario.id) ? getScenarioColor(scenario.id) : 'transparent',
                color: selectedScenarios.has(scenario.id) ? '#fff' : getScenarioColor(scenario.id)
              }}
            >
              {scenario.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              label={{
                value: 'Year',
                position: 'insideBottom',
                offset: -5,
                style: { fontSize: '10px', fontWeight: 500 },
              }}
              tick={{ fontSize: 10 }}
              tickMargin={5}
              domain={zoomDomain || ['dataMin', 'dataMax']}
            />
            <YAxis
              label={{
                value: 'Net Position ($)',
                angle: -90,
                position: 'insideLeft',
                style: {
                  textAnchor: 'middle',
                  fontSize: '10px',
                  fontWeight: 500,
                },
              }}
              tick={{ fontSize: 10 }}
              tickMargin={5}
              width={45}
              tickFormatter={(value) => {
                if (value === undefined || value === null || typeof value !== 'number') return '';
                const maxValue = Math.max(
                  ...(filteredData || []).flatMap(d => 
                    scenarios
                      .filter(s => selectedScenarios.has(s.id))
                      .map(s => {
                        const scenarioData = d[s.id];
                        if (!scenarioData) return 0;
                        const val = scenarioData.netPosition;
                        return typeof val === 'number' ? val : 0;
                      })
                  )
                );
                return formatNumberWithKMB(value, maxValue >= 1000000);
              }}
            />
            <ReferenceLine y={0} stroke="black" strokeWidth={1} />
            <Tooltip
              wrapperStyle={{ outline: 'none' }}
              content={({ payload, label }: TooltipProps<number, string> & { payload?: any[] }) => {
                if (!payload || payload.length === 0) return null;
                
                // Ensure payload values are numbers
                const numericPayload = payload!.map(entry => ({
                  ...entry,
                  value: typeof entry.value === 'number' ? entry.value : 0
                }));
                
                const sortedPayload = [...numericPayload!].sort((a, b) => 
                  (b.value as number) - (a.value as number)
                );
                
                // Calculate max value for formatting
                const maxValue = Math.max(
                  ...(filteredData?.flatMap(d => 
                    scenarios!
                      .filter(s => selectedScenarios.has(s.id))
                      .map(s => {
                        const val = d[s.id]?.netPosition;
                        return typeof val === 'number' ? val : 0;
                      })
                  ) || [0])
                );
                
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 min-w-[250px]">
                    <div className="text-sm font-semibold mb-2">
                      Year: {label}
                    </div>
                    <div className="space-y-2">
                      {sortedPayload.map((entry, index) => {
                        const scenarioId = typeof entry.dataKey === 'string' ? entry.dataKey.split('.')[0] : undefined;
                        const scenario = scenarioId ? scenarios!.find(s => s.id === scenarioId) : undefined;
                        const value = typeof entry.value === 'number' ? entry.value : 0;
                        const isPositive = value >= 0;
                        
                        // Calculate year-over-year change
                        const prevYearData = filteredData?.find(d => d.year === Number(label) - 1);
                        const prevValue = prevYearData && scenarioId && prevYearData[scenarioId] ? prevYearData[scenarioId].netPosition : 0;
                        const yoyChange = typeof prevValue === 'number' ? value - prevValue : 0;
                        
                        // Calculate cumulative total
                        const cumulativeTotal = (filteredData || [])
                          .filter(d => d.year <= Number(label))
                          .reduce((sum, d) => {
                            const val = scenarioId ? d[scenarioId]?.netPosition : 0;
                            return sum + (typeof val === 'number' ? val : 0);
                          }, 0);
                        
                        return (
                          <div key={`item-${index}`}>
                            <div className="flex items-center mb-1">
                              <div 
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: entry.color }}
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {scenario?.name || entry.name}
                                </div>
                                <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                  ${formatNumberWithKMB(value)}
                                </div>
                              </div>
                            </div>
                            <div className="pl-4 text-xs space-y-1">
                              {entry.payload && scenarioId && entry.payload[scenarioId] && (() => {
                                const afterTaxHolding = entry.payload[scenarioId].afterTaxHolding || 0;
                                const isIncome = afterTaxHolding >= 0;
                                const label = isIncome ? 'After-tax income' : 'After-tax holding cost';
                                const valueClass = isIncome ? 'text-green-600' : 'text-red-600';
                                return (
                                  <div className={`text-gray-600 ${valueClass}`}>
                                    {label}: ${formatNumberWithKMB(Math.abs(afterTaxHolding))}
                                  </div>
                                );
                              })()}
                              {scenario?.metadata?.description && (
                                <div className="text-gray-500 italic">
                                  {scenario.metadata.description}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }}
            />
            <Legend />
            {scenarios
              .filter(scenario => selectedScenarios.has(scenario.id))
              .map((scenario, index) => {
              const color = getScenarioColor(scenario.id);
              return (
                <Line
                  key={scenario.id}
                  type="monotone"
                  dataKey={`${scenario.id}.netPosition`}
                  name={scenario.name}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 px-4">
        <Slider
          value={zoomRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value: number) => {
            const year = years[Math.floor((value / 100) * (years.length - 1))];
            return year ? year.toString() : '';
          }}
          min={0}
          max={100}
          step={1}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => setZoomRange([0, 100])}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1 px-2 rounded text-sm"
          >
            Reset Zoom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioComparison;
