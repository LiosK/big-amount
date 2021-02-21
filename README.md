# big-amount

BigInt-based rational number library focused on accounting

## Usage

```javascript
import { q, BigAmount } from "big-amount";

let x = q("1/2")            // Equivalent to BigAmount.create("1/2")
  .ineg()                   // Negation
  .iabs()                   // Absolute value
  .iinv()                   // Reciprocal
  .iadd(q("34.5"))          // Addition
  .isub(q(".67"))           // Subtraction
  .imul(q(-8n, 9n))         // Multiplication
  .idiv(q(10))              // Division
  .ireduce();               // Reduction to the simplest form

console.log(x.toString());  // "-3583/1125"
console.log(x.toFixed(6));  // "-3.184889"
```

Note. `i*()` methods operate _in place_ and return the mutated `this`.

See [BigAmount.create] for `q` function and instance creation.

[bigamount.create]: https://liosk.github.io/big-amount/doc/classes/bigamount.html#create

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
