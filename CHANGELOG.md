# Changelog

## Unreleased

### Maintenance

- Fixed typo in README.

## v2.1.4 - 2024-06-19

### Fixed

- Broken browser test runner.

### Maintenance

- Changed naming convention of test files.
- Updated dev dependencies.

## v2.1.3 - 2023-07-20

### Maintenance

- Updated dev dependencies.

## v2.1.2 - 2023-03-29

### Maintenance

- Updated dev dependencies.

## v2.1.1 - 2022-11-28

### Maintenance

- Eliminated [[target]]-style links from doc comments.
- Updated dev dependencies.

## v2.1.0 - 2022-02-06

### Added

- `fixedDiv()`, `quantMul()`, and `quantDiv()`.

### Maintenance

- Updated dev dependencies.

## v2.0.1 - 2021-12-13

### Maintenance

- Updated dev dependencies.
- Added badges to README.

## v2.0.0 - 2021-10-23

### Changed

- Signature of `cmp()` from `static cmp(BigAmount, BigAmount): number` to
  `cmp(BigAmount): number`.

### Removed

- Deprecated `precision` parameter from `fromNumber()`.

### Added

- `#ne()`.

### Maintenance

- Updated dev dependencies.

## v1.4.3 - 2021-09-01

### Maintenance

- Updated dev dependencies.

## v1.4.2 - 2021-08-11

### Maintenance

- Updated documents.
- Updated dev dependencies.

## v1.4.1 - 2021-06-12

### Maintenance

- Refactoring and performance tuning.
- Updated dev dependencies.

## v1.4.0 - 2021-06-05

### Added

- `#toExponential()`.

### Maintenance

- Updated dev dependencies.

## v1.3.0 - 2021-05-27

### Added

- `#fixedSub()`.
- Support for number and string fields in object-type arguments of `create()`.

### Maintenance

- Updated dev dependencies.
- Refactored benchmark scripts.

## v1.2.1 - 2021-05-18

### Maintenance

- Updated dev dependencies.

## v1.2.0 - 2021-03-23

### Added

- Comparison methods: `#gt()`, `#ge()`, `#lt()`, and `#le()`.

### Maintenance

- Updated dev dependencies.

## v1.1.2 - 2021-03-14

### Added

- Test case for `fromNumber()` that is specific to the implementation using
  Farey sequences.

### Maintenance

- Refactored test code related to `fromNumber()`.
- Updated dev dependencies.

## v1.1.1 - 2021-03-13

### Added

- Test case for `fromNumber()`.
- Benchmark script for `fromNumber()`.

### Maintenance

- Updated dev dependencies.

## v1.1.0 - 2021-03-10

### Added

- `#isZero()`.

### Deprecated

- `precision` parameter of `fromNumber()` because the argument needs to be
  determined based on highly implementation-specific details.

## v1.0.0 - 2021-03-09

### Added

- Initial stable release.
