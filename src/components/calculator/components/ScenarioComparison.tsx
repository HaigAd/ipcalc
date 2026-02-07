import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Slider } from '../../ui/slider';
import { Checkbox } from '../../ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Info } from 'lucide-react';
import { useCalculatorState } from '../hooks/useCalculatorState';
import { SensitivitySettings, useScenarioProjectionsData } from './ScenarioComparison/useScenarioProjectionsData';
import {
  LineChart,
  Line,
  XAxis,  
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { formatNumberWithKMB } from '../utils/formatters';

const getScenarioColor = (id: string) => {
  // Use a curated palette for readability and a stable hash for fallback.
  const palette = [
    '#0ea5e9',
    '#22c55e',
    '#f97316',
    '#eab308',
    '#14b8a6',
    '#6366f1',
    '#ef4444',
    '#84cc16',
    '#06b6d4',
    '#f59e0b',
    '#10b981',
    '#3b82f6',
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palette.length;
  if (palette[index]) return palette[index];
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 65% 38%)`;
};

const renderCrossDot = (props: { cx?: number; cy?: number; stroke?: string }) => {
  const { cx, cy, stroke } = props;
  if (cx == null || cy == null) return null;
  const size = 3;
  return (
    <g stroke={stroke} strokeWidth={1.5}>
      <line x1={cx - size} y1={cy - size} x2={cx + size} y2={cy + size} />
      <line x1={cx - size} y1={cy + size} x2={cx + size} y2={cy - size} />
    </g>
  );
};

const ScenarioComparison = () => {
  const { scenarios } = useCalculatorState();
  const [selectedScenarios, setSelectedScenarios] = useState<Set<string>>(new Set());
  const [scenarioSensitivityDisplay, setScenarioSensitivityDisplay] = useState<Set<string>>(new Set());
  const [scenarioFilter, setScenarioFilter] = useState('');
  const [hasLoadedPreferences, setHasLoadedPreferences] = useState(false);
  const [hasStoredPreferences, setHasStoredPreferences] = useState(false);
  const [hasInitializedDefaults, setHasInitializedDefaults] = useState(false);

  const STORAGE_KEY = 'calculator_scenario_comparison_preferences';

  const formatCurrency = (value: number) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    return `$${formatNumberWithKMB(safeValue, Math.abs(safeValue) >= 1_000_000)}`;
  };

  const formatPercent = (value: number) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    return `${safeValue.toFixed(2)}%`;
  };

  // Load saved preferences once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setHasStoredPreferences(true);
        const parsed = JSON.parse(raw) as {
          selectedScenarioIds?: string[];
          sensitivityScenarioIds?: string[];
          sensitivityEnabled?: boolean;
          sensitivitySettings?: SensitivitySettings;
          zoomRange?: [number, number];
        };
        if (parsed.selectedScenarioIds) {
          setSelectedScenarios(new Set(parsed.selectedScenarioIds));
        }
        if (parsed.sensitivityScenarioIds) {
          setScenarioSensitivityDisplay(new Set(parsed.sensitivityScenarioIds));
        }
        if (typeof parsed.sensitivityEnabled === 'boolean') {
          setSensitivityEnabled(parsed.sensitivityEnabled);
        }
        if (parsed.sensitivitySettings) {
          setSensitivitySettings(parsed.sensitivitySettings);
        }
        if (parsed.zoomRange) {
          setZoomRange(parsed.zoomRange);
        }
      }
    } catch {
      // Ignore malformed storage data.
    } finally {
      setHasLoadedPreferences(true);
    }
  }, []);

  // Initialize selected scenarios with all scenario IDs once if no saved prefs.
  useEffect(() => {
    if (!hasLoadedPreferences) return;
    if (!scenarios) return;
    if (hasStoredPreferences || hasInitializedDefaults) return;
    setSelectedScenarios(new Set(scenarios.map(s => s.id)));
    setScenarioSensitivityDisplay(new Set(scenarios.map(s => s.id)));
    setHasInitializedDefaults(true);
  }, [scenarios, hasLoadedPreferences, hasStoredPreferences, hasInitializedDefaults]);

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

  const handleSensitivityScenarioToggle = (scenarioId: string) => {
    setScenarioSensitivityDisplay(prev => {
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

  const [sensitivityEnabled, setSensitivityEnabled] = useState(false);
  const [sensitivitySettings, setSensitivitySettings] = useState<SensitivitySettings>({
    interestRateDelta: 1,
    rentIncreaseDelta: 1,
    propertyGrowthDelta: 1
  });
  const processedData = useScenarioProjectionsData(scenarios, sensitivityEnabled, sensitivitySettings);
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 100]);
  const years = useMemo(() => processedData.map(d => d.year), [processedData]);

  const handleZoomChange = (value: number[]) => {
    if (value.length !== 2) return;
    setZoomRange([value[0], value[1]]);
  };

  const zoomDomain = useMemo(() => {
    if (!years.length) return null;
    const startIndex = Math.floor((zoomRange[0] / 100) * (years.length - 1));
    const endIndex = Math.floor((zoomRange[1] / 100) * (years.length - 1));
    const startYear = years[startIndex];
    const endYear = years[endIndex];
    return [startYear, endYear];
  }, [zoomRange, years]);

  const zoomLabels = useMemo(() => {
    if (!years.length) return { start: null, end: null };
    const startIndex = Math.floor((zoomRange[0] / 100) * (years.length - 1));
    const endIndex = Math.floor((zoomRange[1] / 100) * (years.length - 1));
    return { start: years[startIndex], end: years[endIndex] };
  }, [years, zoomRange]);

  const filteredScenarios = useMemo(() => {
    if (!scenarios) return [];
    const query = scenarioFilter.trim().toLowerCase();
    if (!query) return scenarios;
    return scenarios.filter(s => s.name.toLowerCase().includes(query));
  }, [scenarios, scenarioFilter]);


  if (!scenarios || scenarios.length === 0) {
    return <div>No scenarios saved yet.</div>;
  }

  const filteredData = useMemo((): any[] => {
    if (!zoomDomain) return processedData || [];
    return (processedData || []).filter(d => 
      d.year >= zoomDomain[0] && d.year <= zoomDomain[1]
    );
  }, [processedData, zoomDomain]);

  useEffect(() => {
    setScenarioSensitivityDisplay(prev => {
      const next = new Set<string>();
      selectedScenarios.forEach(id => {
        if (prev.has(id)) {
          next.add(id);
        }
      });
      if (next.size === 0 && selectedScenarios.size > 0) {
        selectedScenarios.forEach(id => next.add(id));
      }
      return next;
    });
  }, [selectedScenarios]);

  // Persist preferences.
  useEffect(() => {
    if (!hasLoadedPreferences) return;
    const payload = {
      selectedScenarioIds: Array.from(selectedScenarios),
      sensitivityScenarioIds: Array.from(scenarioSensitivityDisplay),
      sensitivityEnabled,
      sensitivitySettings,
      zoomRange,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage write errors.
    }
  }, [
    hasLoadedPreferences,
    selectedScenarios,
    scenarioSensitivityDisplay,
    sensitivityEnabled,
    sensitivitySettings,
    zoomRange,
  ]);

  const updateSensitivitySetting = (key: keyof SensitivitySettings, value: string) => {
    const parsed = Number(value);
    const sanitized = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    setSensitivitySettings(prev => ({
      ...prev,
      [key]: sanitized
    }));
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-slate-900">Scenario Comparison</h2>
        <p className="text-sm text-slate-600">Compare net position over time across multiple scenarios.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-4 self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pr-1">
          <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Scenarios</div>
                <div className="text-xs text-slate-500">
                  {selectedScenarios.size} of {scenarios.length} selected
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSelectAll(selectedScenarios.size !== scenarios?.length)}
              >
                {selectedScenarios.size === scenarios?.length ? 'Clear' : 'Select all'}
              </Button>
            </div>
            <Input
              value={scenarioFilter}
              onChange={(event) => setScenarioFilter(event.target.value)}
              placeholder="Filter scenarios"
              className="mb-3"
            />
            <TooltipProvider delayDuration={200}>
              <div className="space-y-1 max-h-[320px] overflow-auto pr-1">
                {filteredScenarios.map((scenario) => {
                  const color = getScenarioColor(scenario.id);
                  const checked = selectedScenarios.has(scenario.id);
                  const propertyDetails = scenario.state.propertyDetails;
                  const marketData = scenario.state.marketData;
                  const costStructure = scenario.state.costStructure;

                  return (
                    <UiTooltip key={scenario.id}>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50"
                        >
                          <Checkbox
                            id={`scenario-${scenario.id}`}
                            checked={checked}
                            onCheckedChange={() => handleScenarioToggle(scenario.id)}
                          />
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <Label
                            htmlFor={`scenario-${scenario.id}`}
                            className="text-sm text-slate-700 cursor-pointer flex-1 truncate"
                          >
                            {scenario.name}
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="ml-auto text-slate-500 hover:text-slate-800"
                                onClick={(event) => event.stopPropagation()}
                                aria-label="View scenario details"
                              >
                                <Info className="h-4 w-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent side="right" align="start" className="w-80 p-3">
                              <div className="text-xs font-semibold text-slate-900 mb-2">Scenario details</div>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600">
                                <span>State</span>
                                <span className="text-slate-800">{scenario.state.state}</span>
                                <span>Purchase price</span>
                                <span className="text-slate-800">{formatCurrency(propertyDetails.purchasePrice)}</span>
                                <span>Deposit</span>
                                <span className="text-slate-800">{formatCurrency(propertyDetails.depositAmount)}</span>
                                <span>Interest rate</span>
                                <span className="text-slate-800">{formatPercent(propertyDetails.interestRate)}</span>
                                <span>Loan term</span>
                                <span className="text-slate-800">{propertyDetails.loanTerm} yrs</span>
                                <span>Loan type</span>
                                <span className="text-slate-800">{propertyDetails.loanType}</span>
                                <span>Rent (weekly)</span>
                                <span className="text-slate-800">{formatCurrency(propertyDetails.investmentRent)}</span>
                                <span>Mgmt fee</span>
                                <span className="text-slate-800">
                                  {propertyDetails.managementFee.type === 'percentage'
                                    ? formatPercent(propertyDetails.managementFee.value)
                                    : formatCurrency(propertyDetails.managementFee.value)}
                                </span>
                                <span>Growth rate</span>
                                <span className="text-slate-800">{formatPercent(marketData.propertyGrowthRate)}</span>
                                <span>Rent increase</span>
                                <span className="text-slate-800">{formatPercent(marketData.rentIncreaseRate)}</span>
                                <span>Op ex growth</span>
                                <span className="text-slate-800">{formatPercent(marketData.operatingExpensesGrowthRate)}</span>
                                <span>Maintenance</span>
                                <span className="text-slate-800">{formatPercent(costStructure.maintenancePercentage)}</span>
                                <span>Rates</span>
                                <span className="text-slate-800">{formatCurrency(costStructure.ratesCost)}</span>
                                <span>Insurance</span>
                                <span className="text-slate-800">{formatCurrency(costStructure.insuranceCost)}</span>
                                <span>Water</span>
                                <span className="text-slate-800">{formatCurrency(costStructure.waterCost)}</span>
                                <span>Offset contrib</span>
                                <span className="text-slate-800">
                                  {formatCurrency(propertyDetails.offsetContribution.amount)} / {propertyDetails.offsetContribution.frequency}
                                </span>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="start" className="w-64 p-3">
                        <div className="text-xs font-semibold text-slate-900 mb-2">{scenario.name}</div>
                        {scenario.metadata?.description && (
                          <div className="text-[11px] text-slate-600 mb-2 italic">
                            {scenario.metadata.description}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600">
                          <span>Purchase price</span>
                          <span className="text-slate-800">{formatCurrency(propertyDetails.purchasePrice)}</span>
                          <span>Interest rate</span>
                          <span className="text-slate-800">{formatPercent(propertyDetails.interestRate)}</span>
                          <span>Rent (weekly)</span>
                          <span className="text-slate-800">{formatCurrency(propertyDetails.investmentRent)}</span>
                          <span>Growth rate</span>
                          <span className="text-slate-800">{formatPercent(marketData.propertyGrowthRate)}</span>
                        </div>
                      </TooltipContent>
                    </UiTooltip>
                  );
                })}
                {filteredScenarios.length === 0 && (
                  <div className="text-xs text-slate-500 py-3 text-center">No matching scenarios.</div>
                )}
              </div>
            </TooltipProvider>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <Accordion type="single" collapsible>
              <AccordionItem value="sensitivity">
                <AccordionTrigger className="py-2 text-sm">Sensitivity (Advanced)</AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center gap-2 mb-3">
                    <Checkbox
                      id="sensitivity-enabled"
                      checked={sensitivityEnabled}
                      onCheckedChange={() => setSensitivityEnabled((prev) => !prev)}
                    />
                    <Label htmlFor="sensitivity-enabled" className="text-sm text-slate-700 cursor-pointer">
                      Enable sensitivity bands
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="sensitivity-interest" className="text-xs text-slate-600">
                        Interest rate (±%)
                      </Label>
                      <Input
                        id="sensitivity-interest"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        value={sensitivitySettings.interestRateDelta}
                        onChange={(event) => updateSensitivitySetting('interestRateDelta', event.target.value)}
                        disabled={!sensitivityEnabled}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="sensitivity-rent" className="text-xs text-slate-600">
                        Rent increase (±%)
                      </Label>
                      <Input
                        id="sensitivity-rent"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        value={sensitivitySettings.rentIncreaseDelta}
                        onChange={(event) => updateSensitivitySetting('rentIncreaseDelta', event.target.value)}
                        disabled={!sensitivityEnabled}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="sensitivity-growth" className="text-xs text-slate-600">
                        Property growth (±%)
                      </Label>
                      <Input
                        id="sensitivity-growth"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min="0"
                        value={sensitivitySettings.propertyGrowthDelta}
                        onChange={(event) => updateSensitivitySetting('propertyGrowthDelta', event.target.value)}
                        disabled={!sensitivityEnabled}
                      />
                    </div>
                  </div>

                  {sensitivityEnabled && selectedScenarios.size > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-medium text-slate-600">Bands per scenario</div>
                      <div className="space-y-2">
                        {scenarios
                          ?.filter((scenario) => selectedScenarios.has(scenario.id))
                          .map((scenario) => (
                            <div
                              key={`display-${scenario.id}`}
                              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                            >
                              <span className="text-xs text-slate-700 truncate">{scenario.name}</span>
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`sensitivity-${scenario.id}`} className="text-[11px] text-slate-500">
                                  Bands
                                </Label>
                                <Checkbox
                                  id={`sensitivity-${scenario.id}`}
                                  checked={scenarioSensitivityDisplay.has(scenario.id)}
                                  onCheckedChange={() => handleSensitivityScenarioToggle(scenario.id)}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

        </div>

        <div className="space-y-4 lg:sticky lg:top-4 self-start">
          <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="h-[360px] sm:h-[420px] w-full">
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
                <RechartsTooltip
                  wrapperStyle={{ outline: 'none' }}
                  content={({ payload, label }: TooltipProps<number, string> & { payload?: any[] }) => {
                      if (!payload || payload.length === 0) return null;
                      
                      // Ensure payload values are numbers
                      const numericPayload = payload!.map(entry => ({
                        ...entry,
                        value: typeof entry.value === 'number' ? entry.value : 0
                      }));
                      
                      const filteredPayload = numericPayload.filter(entry => {
                        const dataKey = typeof entry.dataKey === 'string' ? entry.dataKey : '';
                        return !dataKey.includes('netPositionLow') && !dataKey.includes('netPositionHigh');
                      });
                      const sortedPayload = [...filteredPayload].sort((a, b) => 
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
                              const shouldUseMillions = Math.abs(value) >= 1000000;
                              const isExRentLine = typeof entry.dataKey === 'string' && entry.dataKey.includes('netPositionExRent');
                              
                              // Calculate year-over-year change
                              const prevYearData = filteredData?.find(d => d.year === Number(label) - 1);
                              const prevValue = prevYearData && scenarioId && prevYearData[scenarioId] ? prevYearData[scenarioId].netPosition : 0;
                              void prevValue;
                              
                              return (
                                <div key={`item-${index}`}>
                                  <div className="flex items-center mb-1">
                                    <div 
                                      className="w-2 h-2 rounded-full mr-2"
                                      style={{ backgroundColor: entry.color }}
                />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium">
                                        {isExRentLine
                                          ? `${scenario?.name || entry.name} (net position excl. rent savings)`
                                          : (scenario?.name || entry.name)}
                                      </div>
                                      <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                        ${formatNumberWithKMB(value, shouldUseMillions)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="pl-4 text-xs space-y-1">
                                    {!isExRentLine && entry.payload && scenarioId && entry.payload[scenarioId] && (() => {
                                      const afterTaxHolding = entry.payload[scenarioId].afterTaxHolding || 0;
                                      const isIncome = afterTaxHolding >= 0;
                                      const label = isIncome
                                        ? (scenario?.state.propertyDetails.isPPOR ? 'After-tax savings' : 'After-tax income')
                                        : 'After-tax holding cost';
                                      const valueClass = isIncome ? 'text-green-600' : 'text-red-600';
                                      const shouldUseMillions = Math.abs(afterTaxHolding) >= 1000000;
                                      return (
                                        <>
                                          <div className={`text-gray-600 ${valueClass}`}>
                                            {label}: ${formatNumberWithKMB(Math.abs(afterTaxHolding), shouldUseMillions)}
                                          </div>
                                          {scenario?.state.propertyDetails.isPPOR && (() => {
                                            const rentSavingsTotal = entry.payload[scenarioId].rentSavingsTotal || 0;
                                            if (rentSavingsTotal === 0) return null;
                                            const rentSavingsMillions = Math.abs(rentSavingsTotal) >= 1000000;
                                            return (
                                              <div className="text-gray-500">
                                                PPOR net position includes rental savings of ${formatNumberWithKMB(rentSavingsTotal, rentSavingsMillions)} total
                                              </div>
                                            );
                                          })()}
                                        </>
                                      );
                                    })()}
                                    {entry.payload && scenarioId && entry.payload[scenarioId] && (() => {
                                      const offsetBalance = entry.payload[scenarioId].offsetBalance || 0;
                                      const depositAmount = scenario?.state.propertyDetails.depositAmount || 0;
                                      const cumulativePrincipalPaid = entry.payload[scenarioId].cumulativePrincipalPaid || 0;
                                      const principalTotal = depositAmount + cumulativePrincipalPaid;
                                      const offsetMillions = Math.abs(offsetBalance) >= 1000000;
                                      const principalMillions = Math.abs(principalTotal) >= 1000000;
                                      return (
                                        <>
                                          {offsetBalance > 0 && (
                                            <div className="text-gray-500">
                                              Excludes offset balance of ${formatNumberWithKMB(offsetBalance, offsetMillions)}
                                            </div>
                                          )}
                                          <div className="text-gray-500">
                                            Excludes principal payments of ${formatNumberWithKMB(principalTotal, principalMillions)} (incl. deposit)
                                          </div>
                                        </>
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
                  {scenarios
                    .filter(scenario => selectedScenarios.has(scenario.id))
                    .map((scenario) => {
                    const color = getScenarioColor(scenario.id);
                    return (
                      <React.Fragment key={scenario.id}>
                        <Line
                          type="monotone"
                          dataKey={`${scenario.id}.netPosition`}
                          name={scenario.name}
                          stroke={color}
                          strokeWidth={2}
                          dot={false}
                          connectNulls={false}
                        />
                        {scenario.state.propertyDetails.isPPOR && (
                          <Line
                            type="monotone"
                            dataKey={`${scenario.id}.netPositionExRent`}
                            name={`${scenario.name} (net position excl. rent savings)`}
                            stroke={color}
                            strokeWidth={1.5}
                            strokeOpacity={0.6}
                            dot={renderCrossDot}
                            activeDot={false}
                            connectNulls={false}
                          />
                        )}
                        {sensitivityEnabled && scenarioSensitivityDisplay.has(scenario.id) && (
                          <>
                            <Line
                              type="monotone"
                              dataKey={`${scenario.id}.netPositionLow`}
                              name={`${scenario.name} (low)`}
                              stroke={color}
                              strokeWidth={1.5}
                              strokeDasharray="4 4"
                              strokeOpacity={0.6}
                              dot={false}
                              connectNulls={false}
                              legendType="none"
                            />
                            <Line
                              type="monotone"
                              dataKey={`${scenario.id}.netPositionHigh`}
                              name={`${scenario.name} (high)`}
                              stroke={color}
                              strokeWidth={1.5}
                              strokeDasharray="4 4"
                              strokeOpacity={0.6}
                              dot={false}
                              connectNulls={false}
                              legendType="none"
                            />
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-900">Zoom range</div>
              <Button variant="ghost" size="sm" onClick={() => setZoomRange([0, 100])}>
                Reset
              </Button>
            </div>
            <Slider
              value={[zoomRange[0], zoomRange[1]]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleZoomChange}
            />
            <div className="mt-2 text-xs text-slate-600">
              {zoomLabels.start && zoomLabels.end
                ? `${zoomLabels.start} → ${zoomLabels.end}`
                : 'Full range'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioComparison;
