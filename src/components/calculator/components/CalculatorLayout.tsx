import { ComponentId } from '../hooks/useComponentOrder';

interface CalculatorLayoutProps {
  components: { id: ComponentId; title: string; isFullWidth?: boolean }[];
  renderComponent: (id: ComponentId) => React.ReactNode;
}

export function CalculatorLayout({ components, renderComponent }: CalculatorLayoutProps) {
  return (
    <div className="flex flex-wrap gap-6">
      {components.map((component) => (
        <div 
          key={component.id} 
          className={`mb-6 ${
            component.isFullWidth 
              ? 'w-full' 
              : 'w-full md:grow md:basis-[calc(50%-12px)] min-w-[450px]'
          }`}
        >
          {renderComponent(component.id)}
        </div>
      ))}
    </div>
  );
}
