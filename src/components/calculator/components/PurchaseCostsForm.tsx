import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card } from '../../ui/card';
import { PurchaseCosts } from '../types';

interface PurchaseCostsFormProps {
  purchaseCosts: PurchaseCosts;
  onConveyancingFeeChange: (fee: number) => void;
  onBuildingAndPestFeeChange: (fee: number) => void;
}

export function PurchaseCostsForm({
  purchaseCosts,
  onConveyancingFeeChange,
  onBuildingAndPestFeeChange
}: PurchaseCostsFormProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Purchase Costs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="conveyancingFee">Conveyancing Fee ($)</Label>
          <Input
            id="conveyancingFee"
            type="number"
            value={purchaseCosts.conveyancingFee}
            onChange={(e) => onConveyancingFeeChange(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buildingAndPestFee">Building & Pest Inspection ($)</Label>
          <Input
            id="buildingAndPestFee"
            type="number"
            value={purchaseCosts.buildingAndPestFee}
            onChange={(e) => onBuildingAndPestFeeChange(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transferFee">Transfer Fee ($)</Label>
          <Input
            id="transferFee"
            type="number"
            value={purchaseCosts.transferFee}
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stampDuty">Stamp Duty ($)</Label>
          <Input
            id="stampDuty"
            type="number"
            value={purchaseCosts.stampDuty}
            disabled
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mortgageRegistrationFee">Mortgage Registration Fee ($)</Label>
          <Input
            id="mortgageRegistrationFee"
            type="number"
            value={purchaseCosts.mortgageRegistrationFee}
            disabled
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="totalPurchaseCosts">Total Purchase Costs ($)</Label>
          <Input
            id="totalPurchaseCosts"
            type="number"
            value={purchaseCosts.total}
            disabled
          />
        </div>
      </div>
    </Card>
  );
}
