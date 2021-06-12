# Changelog

## Unreleased

### Maintenance

- Refactoring and performance tuning.

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
