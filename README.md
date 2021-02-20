# big-amount

TypeScript BigInt-based rational number library focused on accounting

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

Note. `i*()` methods perform in-place operations and return the mutated `this`.
