import { TabContentProps } from './types';
import { InvestmentTab } from '../InvestmentTab';
import { CostStructureForm } from '../CostStructureForm';

export function IncomeTabContent({
  propertyDetails,
  marketData,
  costStructure,
  calculationResults,
  setPropertyDetails,
  onCostStructureChange,
  onMarketDataChange
}: Pick<TabContentProps, 
  'propertyDetails' | 
  'marketData' | 
  'costStructure' | 
  'calculationResults' | 
  'setPropertyDetails' | 
  'onCostStructureChange' |
  'onMarketDataChange'
>) {
  return (
    <div className="space-y-6">
      <InvestmentTab
        propertyDetails={propertyDetails}
        setPropertyDetails={setPropertyDetails}
      />
      <CostStructureForm
        costStructure={costStructure}
        setCostStructure={onCostStructureChange}
        yearlyProjections={calculationResults.yearlyProjections}
        propertyDetails={propertyDetails}
        marketData={marketData}
        setMarketData={onMarketDataChange}
      />
    </div>
  );
}
