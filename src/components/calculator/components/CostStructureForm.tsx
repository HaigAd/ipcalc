import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card } from '../../ui/card';
import { CostStructure, YearlyProjection, PropertyDetails, MarketData } from '../types';
import { MaintenanceSlider } from './MaintenanceSlider';
import { FutureSellingCosts } from './FutureSellingCosts';
import { OperatingExpensesGrowthSlider } from './OperatingExpensesGrowthSlider';

interface CostStructureFormProps {
  costStructure: CostStructure;
  setCostStructure: (costs: Partial<CostStructure>) => void;
  yearlyProjections: YearlyProjection[];
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  setMarketData: (data: MarketData) => void;
}

export function CostStructureForm({ 
  costStructure, 
  setCostStructure, 
  yearlyProjections, 
  propertyDetails,
  marketData,
  setMarketData
}: CostStructureFormProps) {
  const handleCostChange = (field: keyof CostStructure, value: number) => {
    const updates: Partial<CostStructure> = {
      [field]: value
    };
    
    // Recalculate total annual costs
    updates.annualPropertyCosts = (field === 'waterCost' ? value : costStructure.waterCost) +
      (field === 'ratesCost' ? value : costStructure.ratesCost) +
      (field === 'insuranceCost' ? value : costStructure.insuranceCost) +
      costStructure.maintenanceCost;
    
    setCostStructure(updates);
  };

  const handleOperatingExpensesGrowthChange = (value: number) => {
    setMarketData({
      ...marketData,
      operatingExpensesGrowthRate: value
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Property Costs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="waterCost">Water Costs ($)</Label>
          <Input
            id="waterCost"
            type="number"
            value={costStructure.waterCost}
            onChange={(e) => handleCostChange('waterCost', Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ratesCost">Council Rates ($)</Label>
          <Input
            id="ratesCost"
            type="number"
            value={costStructure.ratesCost}
            onChange={(e) => handleCostChange('ratesCost', Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="insuranceCost">Insurance ($)</Label>
          <Input
            id="insuranceCost"
            type="number"
            value={costStructure.insuranceCost}
            onChange={(e) => handleCostChange('insuranceCost', Number(e.target.value))}
          />
        </div>

        <MaintenanceSlider
          costStructure={costStructure}
          propertyDetails={propertyDetails}
          onMaintenanceChange={setCostStructure}
        />

        <div className="space-y-2">
          <Label>Total Annual Costs</Label>
          <div className="text-lg font-semibold">
            ${costStructure.annualPropertyCosts.toLocaleString()}
          </div>
        </div>

        <FutureSellingCosts
          costStructure={costStructure}
          yearlyProjections={yearlyProjections}
          onSellingCostsChange={setCostStructure}
        />

        <div className="col-span-2">
          <OperatingExpensesGrowthSlider
            marketData={marketData}
            costStructure={costStructure}
            onOperatingExpensesGrowthChange={handleOperatingExpensesGrowthChange}
          />
        </div>
      </div>
    </Card>
  );
}
