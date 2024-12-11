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
