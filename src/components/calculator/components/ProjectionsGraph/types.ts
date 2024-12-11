import { YearlyProjection } from '../../types';

export interface ProjectionsGraphProps {
  yearlyProjections: YearlyProjection[];
}

export interface ProcessedDataPoint extends YearlyProjection {
  positiveValue: number | null;
  negativeValue: number | null;
  transitionValue: number | null;
}

export interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

export interface TooltipPayload {
  value: number | null;
  payload: YearlyProjection;
}

export interface TooltipSectionProps {
  title: string;
  items: {
    label: string;
    value: number;
    valueClassName?: string;
    isPercentage?: boolean;
  }[];
}
