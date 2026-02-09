import { TabContentProps } from './types';
import { PurchaseCostsForm } from '../PurchaseCostsForm';

export function PurchaseTabContent({
  propertyDetails,
  setPropertyDetails,
  purchaseCosts,
  onConveyancingFeeChange,
  onBuildingAndPestFeeChange,
  onStateChange,
  shouldFlash,
  shouldOpenDetails
}: Pick<TabContentProps, 
  'propertyDetails' |
  'setPropertyDetails' |
  'purchaseCosts' | 
  'onConveyancingFeeChange' | 
  'onBuildingAndPestFeeChange' | 
  'onStateChange' | 
  'shouldFlash' |
  'shouldOpenDetails'
>) {
  return (
    <PurchaseCostsForm
      purchaseCosts={purchaseCosts}
      propertyDetails={propertyDetails}
      setPropertyDetails={setPropertyDetails}
      onConveyancingFeeChange={onConveyancingFeeChange}
      onBuildingAndPestFeeChange={onBuildingAndPestFeeChange}
      onStateChange={onStateChange}
      shouldFlash={shouldFlash}
      shouldOpenDetails={shouldOpenDetails}
    />
  );
}
