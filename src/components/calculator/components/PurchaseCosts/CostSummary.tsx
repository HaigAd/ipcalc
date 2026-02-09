import { MoneyInput } from './MoneyInput';
import { PurchaseCosts } from '../../types';

interface CostSummaryProps {
  costs: Pick<PurchaseCosts, 'transferFee' | 'lmi' | 'stampDuty' | 'mortgageRegistrationFee' | 'total'>;
}

export function CostSummary({ costs }: CostSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <MoneyInput
        id="transferFee"
        label="Transfer Fee ($)"
        value={costs.transferFee}
        disabled
      />
      <MoneyInput
        id="stampDuty"
        label="Stamp Duty ($)"
        value={costs.stampDuty}
        disabled
      />
      <MoneyInput
        id="lmi"
        label="LMI ($)"
        value={costs.lmi}
        disabled
      />
      <MoneyInput
        id="mortgageRegistrationFee"
        label="Mortgage Registration Fee ($)"
        value={costs.mortgageRegistrationFee}
        disabled
      />
      <MoneyInput
        id="totalPurchaseCosts"
        label="Total Purchase Costs ($)"
        value={costs.total}
        disabled
        className="md:col-span-2"
      />
    </div>
  );
}
