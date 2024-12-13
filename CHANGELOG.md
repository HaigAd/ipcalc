# Changelog

## [Unreleased]

### Fixed
- Fixed house appreciation calculation in useComparativeMetrics
  - Changed calculation to be current value minus original purchase price
  - Previously was incorrectly subtracting both deposit and original loan balance
  - This ensures accurate capital growth tracking over time

### Fixed
- Fixed interest calculation with offset
  - Corrected effectiveLoanBalance to use balance after offset subtraction
  - Fixed yearly mortgage cost calculation to use correct effective balance
  - Added detailed debug logging for loan balance tracking
  - Ensured consistent offset calculations across components

### Changed
- Enhanced loan term reduction display in OffsetBenefits component
  - Added months to loan term reduction calculation
  - Updated display format to show both years and months
  - Improved readability with conditional formatting based on reduction period

### Changed
- Updated KeyMetrics component to display correct loan amount
  - Added principal to CalculationResults type
  - Modified KeyMetrics to show initial loan amount instead of cumulative principal paid
  - Ensured consistent loan amount display across components

### Changed
- Consolidated offset calculations for improved efficiency
  - Removed redundant offsetCalculations.ts and useOffsetCalculations.ts
  - Moved all offset calculations into usePropertyProjections
  - Simplified calculation flow in usePropertyCalculator
  - Added years reduced calculation directly in monthly compounding loop
  - Improved accuracy by calculating all offset benefits at monthly level

### Fixed
- Fixed loan balance and offset calculations
  - Corrected loan amount to be purchase price minus deposit only
  - Fixed offset amount calculation to be savings minus all upfront costs (deposit + purchase costs)
  - Maintained monthly compounding for accurate loan payoff tracking
  - Ensured consistent offset calculations across components
  - Fixed loan term reduction calculation based on actual payoff year

### Changed
- Reverted to initial state of Major-Refactor branch
  - Reset to commit "Initial commit before code refactoring"
  - Removed all subsequent changes and fixes
  - This provides a clean slate for the refactoring work

## [Previous Versions]
... (previous entries remain unchanged)
### Fixed
- Fixed cashflow calculation in useComparativeMetrics
  - Changed calculation to use rental income minus total mortgage payment (principal + interest) minus annual costs
  - Previously was incorrectly calculating mortgage costs
  - Added yearly rental income calculation based on weekly rent

### Fixed
- Fixed originalLoanBalance calculation in PropertyProjections
  - Moved calculation to constructor to prevent recalculation each year
  - Ensures loan amount remains constant throughout projections
  - Original loan amount correctly reflects purchase price minus deposit

### Fixed
- Fixed loan balance tracking in usePropertyProjections
  - Separated originalLoanBalance (constant initial loan amount) from noOffsetLoanBalance (used for interest savings calculations)
  - Renamed variables to better reflect their purpose
  - Ensures original loan amount stays constant while still accurately calculating offset benefits

### Fixed
- Fixed investment pool calculation in PropertyProjections
  - Changed initial investment pool to start with deposit + purchase costs + available savings
  - Previously was incorrectly starting with just available savings
  - This ensures accurate tracking of total upfront investment required including offset amount
  - Offset amount is included since it won't be used to offset a property in rental scenario

### Fixed
- Fixed property value appreciation calculation after loan payoff with offset
  - Moved property value and rent calculations to start of yearly loop
  - Previously was skipping appreciation in years after loan payoff
  - Ensures consistent property value growth throughout projection period

### Changed
- Updated mortgage cost calculation in useComparativeMetrics
  - Now using yearlyInterestPaid from usePropertyProjections which uses monthly compounding
  - Previously was using a simpler yearly calculation
  - This provides more accurate interest cost tracking

### Changed
- Enhanced DepositSlider component with manual input capability
  - Added direct numeric input field for deposit amount
  - Maintained existing slider functionality and styling
  - Input automatically validates against min/max deposit constraints
  - Updates synchronize between input field and slider
  - Preserves all existing deposit calculations and constraints

### Changed
- Refined DepositSlider component UX
  - Relocated edit icon next to "Deposit Amount" label for better visibility
  - Enhanced input field interaction with label-level edit button
  - Improved number formatting and validation
  - Fixed input/slider synchronization
  - Added hover effects and accessibility improvements

### Added
- Added support for periodic offset account contributions
  - New offsetContribution field in PropertyDetails type with amount and frequency (weekly/monthly/yearly)
  - Enhanced usePropertyProjections to handle growing offset balance from contributions
  - Updated useComparativeMetrics to include contributions in investment pool calculations
  - Added tracking of yearly and cumulative offset contributions
  - Improved accuracy of opportunity cost calculations with regular contributions

### Added
- Created new OffsetContributionForm component
  - Added form for setting regular offset contributions
  - Supports weekly/monthly/yearly contribution frequencies
  - Includes explanatory text about contribution impacts
- Enhanced OffsetBenefits component
  - Added display of total contributions made
  - Updated explanatory text to clarify contribution impacts
  - Improved layout with clearer benefit breakdowns
- Updated YearlyProjectionsTable columns
  - Added yearly and cumulative offset contribution columns
  - Enhanced investment pool tooltip to include contributions
  - Improved column grouping and formatting

### Fixed
- Fixed offset contribution handling
  - Added default offsetContribution to defaultPropertyDetails
  - Added backward compatibility for undefined offsetContribution
  - Improved error handling in getMonthlyContribution function
  - Ensured consistent contribution tracking across calculations

### Changed
- Enhanced LoanDetailsForm with expandable offset contributions section
  - Added collapsible accordion section for extra payments
  - Shows contribution amount and frequency in collapsed state
  - Integrates OffsetContributionForm for detailed configuration
  - Improved UI with consistent styling and spacing

### Fixed
- Fixed handling of undefined offsetContribution in LoanDetailsForm
  - Added fallback to default values when offsetContribution is undefined
  - Improved null checking in offset summary display
  - Ensured proper initialization of offset contribution values
  - Added backward compatibility for existing property details

### Changed
- Updated OffsetBenefits component to format large numbers with K/M suffixes
  - Added formatLargeNumber utility function
  - Applied K/M formatting to card values to prevent overflow
  - Maintained full number formatting in explanatory text
  - Improved readability of large financial figures

### Fixed
- Fixed rent vs buy cash flow calculation in useComparativeMetrics
  - Now using appreciated rental costs from projections instead of initial weekly rent
  - This ensures rental costs properly increase over time with the rent increase rate
  - Previously was incorrectly using initial rent without appreciation

### Added
- Added mortgage calculation verification scripts
  - Created standalone verification tool for amortization calculations
  - Tests multiple scenarios including offset and contributions
  - Provides detailed yearly breakdowns for validation
  - Helps ensure calculation accuracy across different loan parameters

### Changed
- Identified unused files that can be removed:
  - src/components/calculator/RentVsBuyCalculator.tsx - Not imported or used anywhere
  - src/components/calculator/hooks/useMarketScenarios.old - Old file that was replaced
  - src/components/calculator/components/PropertyDetailsForm.tsx - Only used in unused RentVsBuyCalculator
  - src/components/calculator/calculations/offsetCalculations.ts - Consolidated into usePropertyProjections
  - src/components/calculator/hooks/useOffsetCalculations.ts - Consolidated into usePropertyProjections
  - src/components/calculator/components/ProjectionsGraph.tsx - Duplicate of ProjectionsGraph/index.tsx with older implementation

## [2024-01-09]
### Added
- Created a copy of ts-playground as ip-calc to serve as a base for a similar project
- This copy includes all source files, configurations, and dependencies

### Changed
- Refactored property calculator for investment property analysis:
  - Removed rent vs buy comparison functionality
  - Added new investment-specific calculations including management fees, depreciation, and tax benefits
  - Created new components:
    * ManagementFeeSlider: Configurable property management fees (percentage or fixed)
    * DepreciationForm: Capital works and plant/equipment depreciation inputs
    * InvestmentMetrics: Display of key investment metrics (cash flow, ROI, tax position)
  - Added investment property fields to PropertyDetails type
  - Created useInvestmentMetrics hook for investment-specific calculations

### Changed
- Integrated investment property tracking into UI:
  - Added new InvestmentTab component combining management fees, depreciation, and investment metrics
  - Added Investment tab to calculator navigation
  - Displays key metrics including cash flow, ROI, depreciation benefits, and tax position
  - Shows monthly and annual breakdowns of income, expenses, and returns
  - Updated CalculatorTabs component to properly handle investment property props and state management

### Changed
- Removed rent vs buy comparison functionality
  - Removed RentVsBuyCalculator.tsx, useComparativeMetrics.ts, and PropertyDetailsForm.tsx
  - Removed rent vs buy related fields from types and interfaces
  - Simplified PropertyDetails to focus on investment property calculations
  - Updated usePropertyProjections to use investmentRent instead of weeklyRent
  - Renamed and reorganized calculator tabs to focus on investment property management
  - Added new InvestmentRentInput component for setting rental income
  - Updated ManagementFeeSlider to use investmentRent for calculations

### In Progress - Removing Rent vs Buy Functionality
#### Completed:
- Removed RentVsBuyCalculator.tsx and PropertyDetailsForm.tsx
- Updated types.ts to remove rent vs buy fields and focus on investment property
- Added new InvestmentRentInput component
- Updated ManagementFeeSlider to use investmentRent
- Updated usePropertyProjections to use investmentRent
- Renamed calculator tabs to focus on investment property management
- Updated YearlyProjectionsTable columns for investment focus
- Started updating ProjectionsGraph components for investment metrics

#### Still To Do:
- Fix TypeScript errors in ProjectionsGraph components
- Remove useComparativeMetrics.ts and other rent vs buy calculation files
- Update PropertyPriceForm to remove weeklyRent field
- Clean up any remaining rent vs buy references in:
  - PropertyCalculator.tsx
  - usePropertyCalculator.ts
  - calculations/propertyProjections.ts
  - calculations/cgtCalculations.ts
  - calculations/states/* (PPOR and first home buyer logic)
  - TaxImplications.tsx (PPOR references)
  - Any other components that might reference rent vs buy comparisons

### Changed
- Completed removal of rent vs buy functionality:
  - Removed weeklyRent field from PropertyPriceForm
  - Updated TaxImplications to focus on investment property tax benefits
  - Updated usePurchaseCosts to always pass false for isPPOR and isFirstHomeBuyer
  - Kept state calculation files unchanged for compatibility with other calculators

### Fixed
- Removed deprecated rent vs buy functionality remnants
  - Removed useComparativeMetrics hook and its usage in usePropertyCalculator
  - Removed PropertySwitches component and its usage in LoanDetailsForm
  - Simplified usePropertyCalculator to focus on investment property calculations
  - These changes resolve 404 errors from missing files that were meant to be removed in previous cleanup

### Fixed
- Fixed setPropertyDetails not being passed correctly to InvestmentTab
  - Removed anti-pattern of extracting setPropertyDetails from rendered component
  - Added setPropertyDetails as direct prop to CalculatorTabs
  - Fixed investment rent input functionality

### Changed
- Consolidated investment property calculations
  - Merged useInvestmentMetrics functionality into usePropertyProjections
  - Enhanced amortization calculations to include investment metrics
  - Added tax benefit, depreciation, and ROI calculations directly in projections
  - Improved accuracy by calculating all metrics in the same loop
  - Added netPositionAtEnd, totalDepreciation, and averageROI to results
  - This consolidation ensures consistent calculations and better maintainability

### Fixed
- Fixed yearly projections calculations:
  - Improved tax benefit calculation to properly account for tax brackets and base amounts
  - Updated ROI calculation to use total invested capital including principal and offset contributions
  - Fixed property value appreciation timing for accurate equity gain calculations

### Fixed
- Removed duplicate YearlyProjectionsTable.tsx file that contained outdated rent vs buy columns
  - The folder implementation (YearlyProjectionsTable/) is now the single source of truth
  - This removes confusing rental scenario information from yearly projections

### Changed
- Updated YearlyProjectionsTable to use props instead of removed CalculatorContext
  - Removed context dependency and added proper prop types
  - Updated TableFooter explanations to focus on investment metrics
  - Removed outdated rent vs buy references from table footer

### Changed
- Added interest expenses and other expenses columns to projections table
  - Split expenses into Interest, Management, Other, and Total categories
  - Other expenses calculated as total minus interest and management fees
  - Improved expense breakdown visibility for better analysis

### Added
- Added operating expenses growth rate slider (0-10%, default 2.5%)
  - New slider component for setting annual growth rate of operating expenses
  - Operating expenses now increase yearly based on growth rate
  - Added operatingExpensesGrowthRate to MarketData interface
  - Updated projections calculations to account for growing expenses
  - Shows projected costs and annual increase in slider card

### Changed
- Restructured calculator tabs for better organization:
  - Renamed 'Property Details' to 'Investment Overview' for clarity
  - Consolidated rental income and operating expenses into 'Income & Expenses' tab
  - Created new 'Tax & Depreciation' tab combining tax implications and depreciation settings
  - Improved tab naming and organization for investment property focus
  - Added depreciation and taxImplications to ComponentId type

### Changed
- Streamlined InvestmentTab component:
  - Moved depreciation settings to dedicated Tax & Depreciation tab
  - Focused InvestmentTab on rental income and property management
  - Maintained investment metrics display for quick reference
  - Improved component organization and user flow

### Changed
- Simplified slider components and improved real-time updates
  - Added real-time value updates to operating expenses growth slider
  - Removed cost projections from sliders to reduce complexity
  - Improved slider responsiveness with local state management
  - Enhanced user experience with smoother value updates during dragging

### Added
- Added TaxableIncomeInput component to Tax & Depreciation tab
  - Allows users to input their annual taxable income
  - Shows current tax bracket and marginal rate
  - Improves accuracy of tax benefit calculations by considering total taxable income

## [2024-12-11]
### Changed
- Updated tax brackets to 2023-2024 rates:
  - $0 – $18,200: 0%
  - $18,201 – $45,000: 16%
  - $45,001 – $135,000: 30%
  - $135,001 – $190,000: 37%
  - $190,001 and over: 45%
- Updated Medicare levy to 2%
- Enhanced tax calculations to include Medicare levy in total tax payable

### Fixed
- Fixed tax input functionality:
  - Added missing onPropertyDetailsChange prop to TaxImplications component
  - Ensured proper prop drilling for tax input changes
  - Fixed tax bracket display and calculations

### Changed
- Streamlined Tax & Depreciation UI for better usability:
  - Consolidated tax and depreciation inputs into a unified two-column layout
  - Added comprehensive tax benefits summary showing first year and monthly benefits
  - Improved information density by removing redundant whitespace
  - Added tooltips for clearer explanation of each input
  - Removed separate DepreciationForm and TaxableIncomeInput components
  - Integrated all tax and depreciation functionality into TaxImplications component
  - Enhanced visual hierarchy with clear section grouping
  - Added real-time tax bracket and benefit calculations

### Changed
- Refactored CalculatorTabs component for better maintainability:
  - Split into smaller, focused components in new Tabs directory
  - Created reusable TabTrigger and TabContent components
  - Extracted tab configurations into separate config file
  - Separated each tab's content into individual components
  - Improved type safety with dedicated types file
  - Reduced code duplication in styling and layout
  - Maintained all existing functionality while improving code organization

## [2024-01-09]
### Changed
- Enhanced Tax Benefits Summary in TaxImplications component to show progression from original income to final taxable income after deductions, making tax benefit calculation clearer

### Changed
- Refactored TaxImplications component for better maintainability:
  - Split into smaller, focused components (TaxableIncomeSection, DepreciationSection, TaxBenefitsSummary)
  - Created custom useTaxCalculations hook for centralized tax logic
  - Improved type safety with proper TaxBracket interface
  - Maintained all existing functionality while reducing component complexity
  - Removed unused marketData prop
- Updated TaxImplications component usage to match new interface requirements - removed marketData prop and mapped yearlyProjections to required shape

### Added
- Added manual offset override capability
  - Added manualOffsetAmount to PropertyDetails type for direct offset control
  - Added toggle switch to choose between automatic and manual offset calculation
  - In automatic mode, offset is calculated as available savings minus upfront costs
  - In manual mode, user can directly specify any offset amount (including zero)
  - Fixed input handling to maintain manual mode when clearing input
  - Maintains available savings independent of manual offset amount

### Changed
- Removed market scenarios functionality
  - Deleted MarketScenarios.tsx component and useMarketScenarios.old hook
  - Removed scenarios state from useMarketState
  - Removed scenarios from CalculatorContext
  - Deleted unused scenarioProjections.old file
  - Simplified calculator state management by removing unused market scenarios code
2024-12-12 - Refactored usePropertyProjections.ts
- Extracted utility functions into separate projectionUtils.ts file:
  - calculateMonthlyPayment: Monthly mortgage payment calculation
  - getMonthlyContribution: Convert weekly/yearly contributions to monthly
  - calculateManagementFees: Property management fee calculation
  - calculateTotalDepreciation: Total depreciation calculation
- Maintained core yearly/monthly projection loop in usePropertyProjections.ts
- Improved code organization while preserving calculation accuracy

### Changed
- Consolidated metrics display into new CombinedMetrics component
  - Created new CombinedMetrics component that combines KeyMetrics and InvestmentMetrics
  - Removed metrics from tab system and display at bottom of calculator
  - Shows key financial metrics, tax position, and offset benefits in one view
  - Improved layout with consistent styling and better organization
  - Removed old KeyMetrics component from tab system

## [1.0.1] - 2024-12-12
### Changed
- Refactored CombinedMetrics component:
  - Extracted reusable MetricCard and SummaryItem components
  - Added proper TypeScript interfaces
  - Implemented useMemo for performance optimization
  - Added error handling in formatLargeNumber
  - Improved code organization with separate TaxEquitySection
  - Enhanced type safety and maintainability
  - Improved component styling consistency

## [1.0.2] - 2024-12-12
### Changed
- Split CombinedMetrics into smaller components:
  - Created dedicated CombinedMetrics directory
  - Extracted MetricCard, SummaryItem, and TaxEquitySection into separate files
  - Moved utility functions to utils.ts
  - Created index.ts for clean exports
  - Improved code organization and maintainability
  - Reduced file sizes for better readability
### Changed
- Removed tax/depreciation card and financial projections graph from overview tab
  - Removed graph and taxImplications components from ComponentRenderer
  - Removed unused imports and cleaned up component interfaces
  - Tax and depreciation information is now only shown in the dedicated Tax & Depreciation tab
  - Simplified overview tab to focus on core property and loan details

2024-12-12
- Moved YearlyProjectionsTable from tab system to beneath CombinedMetrics
- Removed table component from component order system
- Updated component rendering to reflect new table position

## [Unreleased] - 2024-12-12
- Removed InvestmentMetrics component and cleaned up related references
- Removed remaining rent vs buy functionality and types
- Fixed TypeScript errors related to removed functionality
2024-12-12: Removed CalculatorContext as it was redundant with prop drilling already being used throughout the app. Updated ProjectionsGraph and ComponentRenderer to receive props directly.

2024-12-12 19:27:54
- Fixed tax tab not showing content by properly integrating TaxImplications component into the component rendering system
- Added taxImplications to ComponentId type and component order
- Updated PropertyCalculator to handle tax implications rendering with proper data flow

### Added
- Added Capital Gains Tax (CGT) calculations
  - Implemented 50% CGT discount for properties held over 12 months
  - Added 6-year CGT exemption rule toggle
  - CGT calculated on appreciation above cost base (purchase + costs - depreciation)
  - Updated ROI calculations to consider CGT impact
  - Added CGT estimates to tax benefits summary
  - Added CGT exemption toggle to Tax & Depreciation tab
  - Enhanced yearly projections to track CGT liability

### Changed
- Enhanced tax implications display:
  - Added CGT section to tax benefits summary
  - Shows CGT exemption status and estimated liability
  - Improved tooltips with CGT explanation
  - Updated calculations to reflect CGT impact on overall returns

### Fixed
- Fixed CGT calculation when property becomes positively geared
  - Previously CGT calculation stopped when property was no longer negatively geared due to incorrect marginal rate calculation
  - Now using actual tax bracket rate plus Medicare levy for CGT calculation
  - Ensures consistent CGT tracking throughout projection period regardless of gearing status

### Fixed
- Fixed ROI calculation to properly account for CGT
  - Previously using cumulative CGT with yearly capital gains which understated returns
  - Now calculating yearly CGT based on each year's capital gain for ROI
  - Maintaining cumulative CGT calculation for equity position reporting
  - This ensures ROI accurately reflects yearly performance

### Added
- Added year selector to Investment Summary
  - New horizontal scrollable year selector component
  - Allows viewing metrics for any projection year
  - Updates all metrics including cash flow, ROI, tax position, and equity
  - Shows property value growth from initial value to selected year
  - Maintains projected final year values for comparison

## [2024-01-09]
### Changed
- Enhanced YearSelector with a full-width slider interface
- Fixed year display to correctly show years starting from 1
- Added min/max year labels and prominent current year display
- Improved touch interaction for mobile devices

2024-12-13
- Fixed ROI display in investment summary card by removing redundant multiplication by 100
### Added
- Added loan type selection (Principal & Interest vs Interest Only)
  - Added loanType field to PropertyDetails
  - Updated LoanDetailsForm with radio buttons for loan type selection
  - Modified mortgage calculations to handle both P&I and IO loans
  - Updated projections to account for different loan type behaviors
  - IO loans maintain constant principal while P&I loans reduce principal over time
  - Adjusted cash flow and equity calculations based on loan type
2024-12-13 10:40:30 - Architecture Analysis
- Analyzed current codebase structure and suggested improvements
- Key areas: state management, component organization, data flow, calculation logic
- Proposed new directory structure for better separation of concerns
- Suggested breaking down types.ts into domain-specific files
- Recommended adding proper testing structure
2024-12-13 10:55:06 - Types Reorganization
- Split types.ts into domain-specific files under types/ directory (property, loan, market, tax, metrics)
- Consolidated property-related types into a single PropertyDetails interface
- Added proper type exports with TypeScript isolatedModules support
- Removed redundant types.ts file
- Improved type organization and maintainability
