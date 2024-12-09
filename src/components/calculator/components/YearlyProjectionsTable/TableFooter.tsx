import { MarketData } from '../../types';

interface TableFooterProps {
  marketData: MarketData;
}

export function TableFooter({ marketData }: TableFooterProps) {
  return (
    <div className="mt-4 sm:mt-6 space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-slate-500">
      <p>• Cash Flow Diff shows annual savings from renting vs buying (positive means renting saves money)</p>
      <p>• Annual Returns shows investment returns earned this year at {marketData.opportunityCostRate}%</p>
      <p>• Total Returns shows cumulative investment returns earned to date</p>
      <p>• Investment Pool shows total amount available (initial costs + savings + returns)</p>
      <p>• Net Position compares total returns plus rental costs against property equity</p>
    </div>
  );
}
