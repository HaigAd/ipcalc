export type StampDutyCalculator = (price: number, isPPOR: boolean, isFirstHomeBuyer: boolean) => number;
export type TransferFeeCalculator = (price: number) => number;

export interface StateCalculations {
    stampDuty: StampDutyCalculator;
    transferFee: TransferFeeCalculator;
}
