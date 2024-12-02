import { Card } from '../../ui/card';
import { PropertyDetails, MarketData, PurchaseCosts } from '../types';

interface PurchaseSummaryProps {
  propertyDetails: PropertyDetails;
  marketData: MarketData;
  purchaseCosts: PurchaseCosts;
}

export function PurchaseSummary({ propertyDetails, marketData, purchaseCosts }: PurchaseSummaryProps) {
  return (
    <Card className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Purchase Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Property Price:</span>
          <span>${propertyDetails.purchasePrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Weekly Rent:</span>
          <span>${propertyDetails.weeklyRent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Deposit Amount:</span>
          <span>${propertyDetails.depositAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Loan Amount:</span>
          <span>${(propertyDetails.purchasePrice - propertyDetails.depositAmount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Purchase Costs:</span>
          <span>${purchaseCosts.total.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}
