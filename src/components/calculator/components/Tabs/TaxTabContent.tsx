import { TabContentProps } from './types';

export function TaxTabContent({
  renderComponent
}: Pick<TabContentProps, 'renderComponent'>) {
  return renderComponent?.('taxImplications') || null;
}
