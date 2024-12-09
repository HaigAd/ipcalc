import { MoneyInput } from './MoneyInput';
import { PurchaseCosts } from '../../types';

interface EditableCostsProps {
  costs: Pick<PurchaseCosts, 'conveyancingFee' | 'buildingAndPestFee'>;
  onConveyancingFeeChange: (fee: number) => void;
  onBuildingAndPestFeeChange: (fee: number) => void;
}

export function EditableCosts({
  costs,
  onConveyancingFeeChange,
  onBuildingAndPestFeeChange
}: EditableCostsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MoneyInput
        id="conveyancingFee"
        label="Conveyancing Fee ($)"
        value={costs.conveyancingFee}
        onChange={onConveyancingFeeChange}
      />
      <MoneyInput
        id="buildingAndPestFee"
        label="Building & Pest Inspection ($)"
        value={costs.buildingAndPestFee}
        onChange={onBuildingAndPestFeeChange}
      />
    </div>
  );
}
