import { TabContentProps } from './types';
import { PurchaseCostsForm } from '../PurchaseCostsForm';

export function PurchaseTabContent({
  purchaseCosts,
  onConveyancingFeeChange,
  onBuildingAndPestFeeChange,
  onStateChange,
  shouldFlash
}: Pick<TabContentProps, 
  'purchaseCosts' | 
  'onConveyancingFeeChange' | 
  'onBuildingAndPestFeeChange' | 
  'onStateChange' | 
  'shouldFlash'
>) {
  return (
    <PurchaseCostsForm
      purchaseCosts={purchaseCosts}
      onConveyancingFeeChange={onConveyancingFeeChange}
      onBuildingAndPestFeeChange={onBuildingAndPestFeeChange}
      onStateChange={onStateChange}
      shouldFlash={shouldFlash}
    />
  );
}
