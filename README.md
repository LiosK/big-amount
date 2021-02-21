# big-amount

BigInt-based rational number library focused on accounting

## Usage

```javascript
import { q, BigAmount } from "big-amount";

let x = q("1/2") // Equivalent to BigAmount.create("1/2")
  .neg()
  .abs()
  .inv()
  .add(q("34.5"))
  .sub(q(".67"))
  .mul(q(-8n, 9n))
  .div(q(10))
  .reduce(); // Reduction to the simplest form

console.log(x.toString()); // "-3583/1125"
console.log(x.toFixed(6)); // "-3.184889"
```

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

Note that non-integer `number` values have to be passed as `string`.

```javascript
q(123.45);   // ERROR!
q(123 / 45); // ERROR!
```

[bigamount.create]: https://liosk.github.io/big-amount/doc/classes/bigamount.html#create

### BigAmount.fromNumber

Use [BigAmount.fromNumber] to create an instance from a non-integer `number`
value.

```javascript
BigAmount.fromNumber(Math.PI); // 3.14159...
```

[bigamount.fromnumber]: https://liosk.github.io/big-amount/doc/classes/bigamount.html#fromnumber

## Arithmetic Operations

| Operation           | Regular      | In-place      |
| ------------------- | ------------ | ------------- |
| To irreducible form | `reduce()`   | `ireduce()`   |
| To negated value    | `neg()`      | `ineg()`      |
| To absolute value   | `abs()`      | `iabs()`      |
| To reciprocal       | `inv()`      | `iinv()`      |
| Addition            | `add(other)` | `iadd(other)` |
| Subtraction         | `sub(other)` | `isub(other)` |
| Multiplication      | `mul(other)` | `imul(other)` |
| Division            | `div(other)` | `idiv(other)` |

The regular methods create and return a new object while the in-place methods
mutate and return `this`.

i/reduce() needs to be called explicitly whenever necessary because the
arithmetic operations do not return the canonical form of a resulting fraction.
It is currently guaranteed that i/add() and i/sub() keep the denominator
unchanged if both operands share the same denominator; in all other cases, the
returned value has an implementation-dependent numerator and denominator.

## String Conversion

`toString()` and `toJSON()` generate the preferred seriarization form as a
rational number.

```javascript
String(q(123n, 45n));        // "123/45"
JSON.stringify(q("12.345")); // '"12345/1000"'
```

Use [BigAmount#toFixed] to format a value as a decimal string. This method takes
a few formatting options to customize the output.

```javascript
let x = BigAmount.create("123456789/10");
x.toFixed(2);                            // "12345678.90"
x.toFixed(2, { decimalSeparator: "," }); // "12345678,90"
x.toFixed(2, { groupSeparator: "," });   // "12,345,678.90"
```

[BigAmount#toFixed] rounds ties to the nearest even by default.

```javascript
q("1.15").toFixed(1) // "1.2"
q("1.25").toFixed(1) // "1.2"
```

[bigamount#tofixed]: https://liosk.github.io/big-amount/doc/classes/bigamount.html#tofixed

## License

Copyright 2021 LiosK

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.

## See Also

- [npm package](https://www.npmjs.com/package/big-amount)
- [GitHub repository](https://github.com/LiosK/big-amount)
- [Auto-generated API documentation](https://liosk.github.io/big-amount/doc/)
- [Run tests on your browser](https://liosk.github.io/big-amount/test/run_on_browser.html)
