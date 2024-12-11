import { MarketData } from '../../types';

interface TableFooterProps {
  marketData: MarketData;
}

export function TableFooter({ marketData }: TableFooterProps) {
  return (
    <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-slate-500">
      <p>• Rental Income shows annual rental income after {marketData.rentIncreaseRate}% yearly increases</p>
      <p>• Total Expenses includes interest, management fees, maintenance, and other costs</p>
      <p>• Cash Flow shows net position after all income, expenses, and tax benefits</p>
      <p>• Tax Benefits include negative gearing and depreciation benefits</p>
      <p>• ROI shows annual return on investment considering all income and capital growth</p>
    </div>
  );
}
