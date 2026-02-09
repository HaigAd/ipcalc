# IP Calc (Property Investment Calculator)

React + TypeScript + Vite app for modeling Australian property scenarios, including cash flow, net position, tax effects, and scenario/portfolio comparison over time.

## Quick Start

```bash
npm install
npm run dev
```

Build/lint:

```bash
npm run build
npm run lint
```

Useful script:

```bash
npm run test:projections
```

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (graphing)
- Radix/shadcn-style UI primitives
- Framer Motion (menu animations)
- ExcelJS + file-saver (XLSX export)

## High-Level Architecture

Entry:

- `src/main.tsx` -> renders `src/App.tsx`
- `src/App.tsx` -> renders `PropertyCalculator`

Main feature shell:

- `src/components/calculator/PropertyCalculator.tsx`

Core state/calculation pipeline:

1. `useCalculatorState` assembles app state from defaults + persisted state
2. `usePropertyCalculator` and `usePropertyProjections` compute outputs
3. UI components render inputs + outputs and update state
4. Scenarios are persisted and diffed for unsaved changes

## Directory Map

- `src/components/calculator/components/`  
  Major feature UI (tabs, scenario comparison, tables, export, menus)
- `src/components/calculator/hooks/`  
  State composition + calculation hooks (`useCalculatorState`, `usePropertyCalculator`, `useScenarios`, `usePropertyProjections`, etc.)
- `src/components/calculator/calculations/`  
  Tax/stamp duty/CGT logic and state-specific duty rules
- `src/components/calculator/types/`  
  Domain types
- `src/components/calculator/config/defaults.ts`  
  Default calculator inputs
- `src/components/ui/`  
  Reusable UI primitives

## Key Modules (Read First)

- `src/components/calculator/PropertyCalculator.tsx`  
  Top-level page layout, header actions, tabs, change summary rendering

- `src/components/calculator/hooks/useCalculatorState.ts`  
  Central state wiring and integration point for:
  - persistence (`useFormPersistence`)
  - purchase cost recalculation
  - projections (`usePropertyCalculator`)
  - scenarios (`useScenarios`)

- `src/components/calculator/hooks/usePropertyProjections.ts`  
  Core yearly projection math (loan, offset, income, expenses, tax, CGT, net position)

- `src/components/calculator/components/ScenarioComparison.tsx`  
  Multi-scenario graphing, sensitivity bands, graph options, and portfolio lines

- `src/components/calculator/components/ExportXlsxButton.tsx`  
  XLSX export generation and chart embedding

## Data/Persistence Model

Browser `localStorage` keys used by app features:

- `calculator_state` (base form state persistence)
- `calculator_scenarios` (named scenarios + active scenario id)
- `calculator_scenario_comparison_preferences`  
  Scenario comparison UI preferences (selection, graph options, portfolios, etc.)

No backend. Everything is client-side.

## Scenario and Portfolio Concepts

- **Scenario**: full snapshot of calculator inputs (`propertyDetails`, `marketData`, `costStructure`, `state`)
- **Unsaved changes**: computed by comparing current state against active scenario snapshot
- **Portfolio (Scenario Comparison tab)**: named group of scenarios, graphed as summed performance line

## Tabs and Feature Areas

- Main tab container: `src/components/calculator/components/CalculatorTabs.tsx`
- Scenario Comparison: `src/components/calculator/components/ScenarioComparison.tsx`
- Yearly data table: `src/components/calculator/components/YearlyProjectionsTable/`
- Tax configuration/insights: `src/components/calculator/components/TaxImplications/`

## Recent Capabilities

- **PPOR purchase-cost support**
  - Conditional first-home and owner-occupier purchase-cost pathways are modelled in `usePurchaseCosts`.
  - PPOR benefits panel includes targeted grant precision controls that are only shown when relevant.

- **LMI modelling**
  - LMI supports `Waive`, `Auto (indicative)`, and `Manual amount` modes.
  - LMI is explicitly treated as indicative/lender-specific in UI copy.

- **Land tax (advanced tax tab)**
  - State-specific land tax logic is available under Tax -> Advanced.
  - Land tax attribution supports incremental method using other taxable land holdings.
  - Land tax is calculated from land value (not property value), with annual growth support:
    - default: property growth rate
    - optional: custom land-value growth rate

- **Purchase costs UX**
  - Purchase costs are summarized as `LMI`, `Taxes & Fees`, and `Other`.
  - Main price/deposit card includes a shortcut to open Purchase tab detailed line items.

- **Projection regression script**
  - `npm run test:projections` snapshots are aligned with current calculator defaults and policy model.

## Editing Guide (Where to Change What)

- Change financial math:
  - `src/components/calculator/hooks/usePropertyProjections.ts`
  - `src/components/calculator/calculations/*.ts`
- Change scenario save/load behavior:
  - `src/components/calculator/hooks/useScenarios.ts`
- Change comparison graph behavior/tooltips/series:
  - `src/components/calculator/components/ScenarioComparison.tsx`
  - `src/components/calculator/components/ScenarioComparison/useScenarioProjectionsData.ts`
- Change export format:
  - `src/components/calculator/components/ExportXlsxButton.tsx`
- Change defaults:
  - `src/components/calculator/config/defaults.ts`

## Conventions and Gotchas

- TypeScript strict mode is enabled.
- A lot of calculations are cumulative and order-dependent; preserve year-by-year sequencing when refactoring.
- `netPosition` and graph display options are intentionally distinct in Scenario Comparison (base value vs display transformations).
- Build before commit (`npm run build`) to catch type regressions quickly.

## Current Status Notes

- `PROJECT_OVERVIEW.md` exists but may be partially stale.
- This `README.md` is the preferred onboarding document for agents.
