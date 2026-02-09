# Property Investment Calculator - Project Overview

This file is a concise architecture brief.  
For full onboarding details, use `README.md` first.

## What This App Is

Client-side web app for Australian property investment modeling:

- Loan + offset behavior over time
- Cash flow and net position projections
- CGT/tax implication modeling
- Multi-scenario comparison
- Portfolio-style aggregated scenario graphing
- XLSX export

## Runtime and Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts
- Radix/shadcn-style UI primitives
- LocalStorage persistence (no backend)

## Current Source Layout

```text
src/
  components/
    calculator/
      calculations/        # tax, CGT, stamp duty, state duty rules
      components/          # calculator feature UI
      config/              # defaults
      hooks/               # state + calculation composition
      services/persistence # local persistence helpers
      types/               # domain models
      utils/               # formatting and support utilities
    ui/                    # reusable UI primitives
```

## Core Execution Flow

1. `src/main.tsx` -> `src/App.tsx` -> `PropertyCalculator`
2. `useCalculatorState` hydrates state from persistence/defaults
3. `usePropertyCalculator` / `usePropertyProjections` derive all projections
4. Feature components render and mutate state
5. Scenario and comparison preferences persist in localStorage

## Primary Files to Understand

- `src/components/calculator/PropertyCalculator.tsx`
- `src/components/calculator/hooks/useCalculatorState.ts`
- `src/components/calculator/hooks/usePropertyProjections.ts`
- `src/components/calculator/hooks/useScenarios.ts`
- `src/components/calculator/components/ScenarioComparison.tsx`
- `src/components/calculator/components/ScenarioComparison/useScenarioProjectionsData.ts`
- `src/components/calculator/components/ExportXlsxButton.tsx`

## Persistence Keys

- `calculator_state`
- `calculator_scenarios`
- `calculator_scenario_comparison_preferences`

## Notes for New Agents

- Prefer `README.md` for full “where to change what”.
- This project uses strict TypeScript and calculation-heavy logic; preserve sequencing in projection calculations.
- When changing graph semantics, inspect both:
  - `ScenarioComparison.tsx` (UI/render/tooltips)
  - `useScenarioProjectionsData.ts` (data construction)
