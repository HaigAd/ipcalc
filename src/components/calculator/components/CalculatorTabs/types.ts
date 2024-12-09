import { ComponentType } from 'react';

export interface TabConfig {
  id: string;
  label: string;
  component: ComponentType;
}

export interface TabTriggerProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export interface TabContentProps {
  children: React.ReactNode;
  isActive: boolean;
}
