# Changelog

## [Unreleased]
### Added
- New flexible depreciation schedule system with three modes:
  - Fixed yearly depreciation (existing functionality)
  - Manual yearly input for custom depreciation schedules
  - CSV file upload support for importing depreciation schedules
- New getDepreciation utility function for consistent depreciation calculations
- Support for separate capital works and plant & equipment depreciation schedules

### Changed
- Updated depreciation interface to support multiple depreciation modes
- Refactored tax calculations to use new depreciation system
- Improved type definitions for better type safety

### Technical
- Created new depreciation.ts utility file
- Updated property types to use new depreciation schedule structure
- Modified projection calculations to support flexible depreciation schedules

2024-12-13
- Added flexible depreciation schedule system with three modes (fixed, manual, file upload)
- Added getDepreciation utility function
- Updated tax calculations to use new depreciation system
