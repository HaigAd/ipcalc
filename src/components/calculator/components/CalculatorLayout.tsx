import { ComponentId } from '../hooks/useComponentOrder';

interface CalculatorLayoutProps {
  components: { id: ComponentId; title: string; isFullWidth?: boolean }[];
  renderComponent: (id: ComponentId) => React.ReactNode;
}

export function CalculatorLayout({ components, renderComponent }: CalculatorLayoutProps) {
  return (
    <div className="flex flex-wrap gap-2 xs:gap-3 sm:gap-4 md:gap-6">
      {components.map((component) => (
        <div 
          key={component.id} 
          className={`mb-2 xs:mb-3 sm:mb-4 md:mb-6 w-full ${
            !component.isFullWidth && 'md:basis-[calc(50%-12px)] md:grow'
          }`}
        >
          {renderComponent(component.id)}
        </div>
      ))}
    </div>
  );
}
