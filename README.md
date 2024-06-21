# big-amount

[![npm](https://img.shields.io/npm/v/big-amount)](https://www.npmjs.com/package/big-amount)
[![License](https://img.shields.io/npm/l/big-amount)](https://github.com/LiosK/big-amount/blob/main/LICENSE)

BigInt-based rational number library focused on accounting

- Stores amount as ratio of two [BigInt]s, allowing precise calculation of
  arbitrarily large rational numbers
- Optimized for addition of fractions that share same denominator; little
  overhead on aggregating many cents (1/100)
- Supports rounding and formatting as decimal

```javascript
import { q, BigAmount } from "big-amount";

let f = q("1/2")           // Same as `BigAmount.create("1/2")`
  .neg()                   // Unary `-`
  .inv()                   // Inverse (`1 / f`)
  .add(q("34.5"))          // `+`
  .sub(q(".67"))           // `-`
  .mul(q(-8n, 9n))         // `*`
  .div(q(10))              // `/`
  .abs()                   // To absolute value
  .reduce();               // To irreducible form

console.log(f.toJSON());   // "1061/375"
console.log(f.toFixed(6)); // "2.829333"

let s = BigAmount.sum([
  "2200811.81",
  "5954398.62",
  "-6217732.25",
  "-9336803.50",
]).toFixed(2, {
  groupSeparator: ",",
  templates: ["${}", "$({})"],
});
console.log(s); // "$(7,399,325.32)"
```

Note that this library requires ES2020 compatibility (as does BigInt).

[BigInt]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt

## Instance Creation

### `q` and BigAmount.create

Use [BigAmount.create] or the equivalent shortcut `q` to create an instance.

`BigAmount.create(x)` creates an instance representing _x/1_.

```javascript
q(123n);        // 123/1
q(123);         // 123/1
q("123");       // 123/1
q("123.45");    // 12345/100
q("123.45e-6"); // 12345/100000000

q("123/45");    // 123/45
q("12.3/-4.5"); // 1230/-450
```

`BigAmount.create(x, y)` creates an instance representing _x/y_.

```javascript
q(123n, 45n);    // 123/45
q(123, 45);      // 123/45

q(123, 45n);     // 123/45
q(123n, "4.5");  // 1230/45

q("1/2", "3/4"); // 4/6
q("1/2", "3.4"); // 10/68
```

Note that non-integral `number` values have to be passed as `string`.

```javascript
q(123.45);   // ERROR!
q(123 / 45); // ERROR!
```

[BigAmount.create]: https://liosk.github.io/big-amount/doc/classes/BigAmount.html#create

### BigAmount.fromNumber

Use [BigAmount.fromNumber] to create an instance from a non-integral `number`
value.

```javascript
BigAmount.fromNumber(Math.PI); // 3.14159...
```

[BigAmount.fromNumber]: https://liosk.github.io/big-amount/doc/classes/BigAmount.html#fromNumber

## Arithmetic Operations

| Methods      | Operation                       |
| ------------ | ------------------------------- |
| `neg()`      | Negation (unary `-`)            |
| `add(other)` | Addition (`this + other`)       |
| `sub(other)` | Subtraction(`this - other`)     |
| `mul(other)` | Multiplication (`this * other`) |
| `div(other)` | Division (`this / other`)       |
| `inv()`      | Inverse (`1 / this`)            |
| `abs()`      | To absolute value               |
| `reduce()`   | To irreducible form             |

`reduce()` needs to be called explicitly when an irreducible fraction is
necessary, because the arithmetic operations do not return the canonical form of
a resulting fraction. It is currently guaranteed that `add()` and `sub()` keep
the denominator unchanged if both operands share the same denominator; in all
other cases, the returned object will have implementation-dependent numerator
and denominator.

The following methods are also available for convenience and optimization to
handle accounting use cases.

| Method                 | Operation                                           |
| ---------------------- | --------------------------------------------------- |
| `batchAdd(others)`     | Adds array of BigAmount values at a time            |
| `fixedAdd(other)`      | Addition that keeps the denominator unchanged       |
| `fixedSub(other)`      | Subtraction that keeps the denominator unchanged    |
| `fixedMul(other)`      | Multiplication that keeps the denominator unchanged |
| `fixedDiv(other)`      | Division that keeps the denominator unchanged       |
| `quantMul(other, den)` | Multiplication that resets the denominator to `den` |
| `quantDiv(other, den)` | Division that resets the denominator to `den`       |

## Rounding

`round()` rounds a fraction at a decimal place like the `round` functions of
Python and Excel.

```javascript
q("123.456").round(2);  // 12346/100
q("123.456").round(-1); // 120/1
```

Use `quantize()` to convert a fraction to another that has the specified
denominator.

```javascript
q("123/4").quantize(2n); // 62/2
```

The rounding functions round ties to the nearest even numbers (i.e. bankers'
rounding) by default. See [RoundingMode] for rounding mode options.

[RoundingMode]: https://liosk.github.io/big-amount/doc/types/RoundingMode.html

## Conversion to String

`toJSON()` generates the preferred form to seriarize a rational number.

```javascript
JSON.stringify(q("12.345")); // '"12345/1000"'
```

Use `toFixed()` to format a fraction as decimal. This method takes some
[formatting options] to customize the output.

```javascript
let f = BigAmount.create("123456789/10");
f.toFixed(2);                            // "12345678.90"
f.toFixed(2, { decimalSeparator: "," }); // "12345678,90"
f.toFixed(2, { groupSeparator: "," });   // "12,345,678.90"
f.neg().toFixed(2, {
  decimalSeparator: ",",
  groupSeparator: " ",
  templates: ["{} €"],
});                                      // "-12 345 678,90 €"

const opts = { templates: ["${}", "$({})", "-"] };
BigAmount.create("123.45").toFixed(2, opts); // "$123.45"
BigAmount.create("-678.9").toFixed(2, opts); // "$(678.90)"
BigAmount.create("0").toFixed(2, opts);      // "-"
```

`toExponential()` returns a string representing a fraction in exponential
notation.

```javascript
q("12345.678").toExponential(6); // "1.234568e+4"
```

[formatting options]: https://liosk.github.io/big-amount/doc/interfaces/FormatOptions.html

## License

Licensed under the Apache License, Version 2.0.

## See Also

- [Complete API documentation](https://liosk.github.io/big-amount/doc/)
- [Run tests on your browser](https://liosk.github.io/big-amount/test/)
