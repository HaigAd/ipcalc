# Property Investment Calculator - Technical Overview

## Context and Purpose

### Core Purpose
The Property Investment Calculator is a sophisticated web application designed to help investors make informed decisions about property investments in Australia. It provides comprehensive financial analysis, projections, and comparative metrics for property investment scenarios.

### Business Problems Solved
- Complex property investment calculations automated
- Multi-state tax and duty calculations
- Investment scenario comparison and analysis
- Long-term financial projections and modeling
- Capital Gains Tax (CGT) implications assessment
- Offset account benefit calculations

### Key Technologies
- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom theming
- **UI Components**: Custom component library (shadcn/ui based)
- **State Management**: React Context + Custom Hooks
- **Data Persistence**: Local storage based persistence

### External Dependencies
- React DOM for web rendering
- TailwindCSS for styling
- Various UI component libraries
- TypeScript for type safety
- Vite for development and building

## Architectural Overview

### System Architecture
The application follows a modern React architecture with the following layers:

```
src/
├── components/
│   ├── calculator/    # Core calculator functionality
│   ├── ui/           # Reusable UI components
│   └── custom/       # Custom components
├── lib/              # Utility functions
└── assets/          # Static assets
```

### Component Interaction
1. **Data Flow**:
   ```
   CalculatorContext
         ↓
   State Management Hooks
         ↓
   Calculation Services
         ↓
   UI Components
   ```

2. **State Management**:
   - `CalculatorContext` provides global calculator state
   - Custom hooks manage specific state slices:
     - `usePropertyState`
     - `useMarketState`
     - `useCostState`

### Key Design Patterns
- **Context Provider Pattern** for state management
- **Custom Hook Pattern** for reusable logic
- **Component Composition** for UI flexibility
- **Service Pattern** for calculations
- **State Machine Pattern** for complex state management

## Code Organization

### Main Directories
- `/components/calculator/`: Core calculator functionality
  - `/calculations/`: Mathematical and business logic
  - `/components/`: UI components
  - `/hooks/`: State and logic hooks
  - `/services/`: Supporting services
  - `/context/`: State management
  - `/config/`: Configuration and defaults

### Critical Files
- `PropertyCalculator.tsx`: Main calculator component
- `CalculatorContext.tsx`: Global state management
- `types.ts`: Core type definitions
- `calculations/index.ts`: Central calculation logic

### Module Relationships
- Calculator components consume context and hooks
- Calculation services are pure functions
- UI components are presentation-focused
- Hooks coordinate between state and calculations

## Core Concepts

### Domain Terminology
- **CGT**: Capital Gains Tax calculations
- **Offset Benefits**: Mortgage offset account impacts
- **Market Scenarios**: Different market condition models
- **Comparative Metrics**: Investment comparison tools

### Business Logic Location
- Property calculations: `/calculations/`
- State-specific rules: `/calculations/states/`
- Projection logic: `/calculations/projections/`
- Tax implications: `/calculations/cgtCalculations.ts`

### Data Structures
```typescript
interface PropertyState {
  purchasePrice: number;
  deposit: number;
  // ... other property details
}

interface MarketState {
  growthRate: number;
  rentalYield: number;
  // ... market scenarios
}

interface CostState {
  stampDuty: number;
  transferFee: number;
  // ... associated costs
}
```

## Development Workflow

### Local Development
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access at: `http://localhost:5173`

### Testing Strategy
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Calculation unit tests
- Integration tests for key flows

### Key Development Tools
- VSCode with TypeScript integration
- ESLint for code quality
- Vite for fast development
- TailwindCSS for styling

## Extensibility and Integration

### Extension Points
1. **New Calculations**:
   - Add new calculation modules in `/calculations/`
   - Implement state-specific variations as needed

2. **UI Components**:
   - Add new components in `/components/calculator/components/`
   - Utilize existing UI components from `/components/ui/`

3. **State Management**:
   - Extend context with new state slices
   - Add custom hooks for new functionality

### Adding New Features
1. Define types in `types.ts`
2. Implement calculation logic
3. Create necessary state management
4. Build UI components
5. Integrate with existing calculator flow

### Integration Patterns
- Modular calculation system
- Pluggable UI components
- Extensible state management
- Flexible persistence layer

## Future Considerations


This document serves as a high-level overview of the Property Investment Calculator. For detailed implementation specifics, please refer to the inline documentation and type definitions within the codebase.
