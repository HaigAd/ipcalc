import { ComponentId } from '../hooks/useComponentOrder';

interface CalculatorLayoutProps {
  components: { id: ComponentId; title: string; isFullWidth?: boolean }[];
  renderComponent: (id: ComponentId) => React.ReactNode;
}

export function CalculatorLayout({ components, renderComponent }: CalculatorLayoutProps) {
  return (
    <div className="flex flex-wrap gap-4 sm:gap-6">
      {components.map((component) => (
        <div 
          key={component.id} 
          className={`mb-4 sm:mb-6 w-full ${
            !component.isFullWidth && 'lg:basis-[calc(50%-12px)] lg:grow'
          }`}
        >
          {renderComponent(component.id)}
        </div>
      ))}
    </div>
  );
}
